import { DatabaseStateMerger } from '../../interface';
import { asyncScheduler, AsyncSubject, from, merge, Observable, of } from 'rxjs';
import { OrderItemData } from '../../state-types';
import { DatabaseUrl } from '../../../constant/address';
import * as request from 'superagent';
import { finalize, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';
import { TRADE_PAIR_SYMBOL } from '../../../constant/tokens';
import _ from 'lodash';
import { BigNumber } from 'ethers';
import { S } from '../../contract/contract-state-parser';
import { C } from 'state-manager/cache/cache-state-parser';
import { computePositionPNL } from '../../../util/pnl';
import { contractAccessor } from '../../../wallet/chain-access';
import { OrderRealtimeInfo } from '../../../wallet/contract-interface';
import { argConverter, ListArgObject, ListArgs } from './list-types';

export class ActiveOrdersMerger implements DatabaseStateMerger<OrderItemData[], ListArgs> {
  private cachedFundingFee = new Map<string, BigNumber>();

  /**
   * get and merge
   * maybe send results multi-times.
   * @param args
   */
  public mergeWatch(...args: ListArgs): Observable<OrderItemData[]> {
    const argObj: ListArgObject = argConverter(args);

    return this.doGet(argObj).pipe(
      switchMap((confirmed: OrderItemData[]) => {
        return this.doMergePending(confirmed);
      }),
      switchMap((pendingMerged: OrderItemData[]) => {
        return this.doMergeClosing(pendingMerged);
      }),
      switchMap((closingMerged: OrderItemData[]) => {
        return this.doMergePnl(closingMerged);
      }),
      switchMap((pnlMerged: OrderItemData[]) => {
        return this.doMergeFundingFee(pnlMerged);
      })
    );
  }

  private isPendingChanged(pending: OrderItemData[] | null, newPending: OrderItemData[] | null): boolean {
    if (pending === null && newPending === null) {
      return false;
    }

    if (pending === null || newPending === null) {
      return true;
    }

    if (pending.length !== newPending.length) {
      return true;
    }

    const pendingHash = new Set(pending.map(one => one.hash));
    const newPendingHash = new Set(newPending.map(one => one.hash));
    return !_.isEqual(pendingHash, newPendingHash);
  }

  private doMergePending(confirmed: OrderItemData[]): Observable<OrderItemData[]> {
    return of(confirmed).pipe(
      switchMap((orders: OrderItemData[]) => {
        return C.Order.NewCreate.watch().pipe(
          map((pending: OrderItemData[] | null) => {
            const { newPending, mergeOrders } = this.mergePending(orders, pending);

            // update cache state of pending orders
            if (this.isPendingChanged(pending, newPending)) {
              asyncScheduler.schedule(() => {
                C.Order.NewCreate.set(newPending);
              });
            }

            return mergeOrders;
          })
        );
      })
    );
  }

  private mergePending(
    confirmed: OrderItemData[],
    pending: OrderItemData[] | null
  ): { newPending: OrderItemData[] | null; mergeOrders: OrderItemData[] } {
    const hashes: Set<string> = new Set(confirmed.map(one => one.hash));
    let newPending: OrderItemData[] | null = pending === null ? null : pending.filter(one => !hashes.has(one.hash));

    if (newPending && newPending.length === 0) {
      newPending = null;
    }

    const mergedOrders = newPending ? [...newPending, ...confirmed] : [...confirmed];
    return { newPending, mergeOrders: mergedOrders };
  }

  private doMergeClosing(orders: OrderItemData[]): Observable<OrderItemData[]> {
    return C.Order.NewClose.watch().pipe(
      map((closing: OrderItemData[] | null) => {
        const closingHash: string[] = closing === null ? [] : closing.map(one => one.hash);
        const orderHash: string[] = orders.map(one => one.hash);

        orders.forEach(one => {
          one.isClosing = closingHash.indexOf(one.hash) >= 0;
        });

        if (closing) {
          asyncScheduler.schedule(() => {
            const newClosing = closing.filter(one => orderHash.indexOf(one.hash) >= 0);
            if (newClosing.length !== closing.length) {
              C.Order.NewClose.set(newClosing.length > 0 ? newClosing : null);
            }
          });
        }

        return orders;
      })
    );
  }

  /**
   * get confirmed and active orders
   * @param argObj
   */
  private doGet(argObj: ListArgObject): Observable<OrderItemData[]> {
    const url: string = DatabaseUrl[argObj.network];
    const allSize: number = (argObj.pageIndex + 1) * argObj.pageSize;
    const resObs: Promise<any> = request
      .post(url)
      .send({ page: 0, offset: allSize, state: '1', address: argObj.address, name: 'taker' });

    return from(resObs).pipe(
      map(res => {
        const records: IOrderInfoData[] = res.body.msg;
        return records.map(record => {
          return new OrderInfoObject(record, argObj.network);
        });
      }),
      map((orderInfos: OrderInfoObject[]) => {
        return orderInfos.map(one => one.toOrderItemData());
      })
    );
  }

  private doMergePnl(orders: OrderItemData[]): Observable<OrderItemData[]> {
    if (orders.length === 0) {
      return of([]);
    }

    return this.watchCurPrices(orders).pipe(
      map(([pair, price]) => {
        orders
          .filter(one => one.orderStatus !== 'PENDING')
          .filter(one => one.pairSymbol === pair)
          .forEach(one => {
            const { pnl, percent } = computePositionPNL(one.openPrice, price, one.openAmount, one.pairSymbol);
            one.positionPNLVal = pnl;
            one.positionPNLPercent = percent;
          });

        return [...orders];
      })
    );
  }

  private doMergeFundingFee(orders: OrderItemData[]): Observable<OrderItemData[]> {
    return this.getFundingFees(orders).pipe(
      map(fees => {
        orders.forEach(one => {
          if (fees.has(one.id)) {
            one.fundingFee = fees.get(one.id) as BigNumber;
          }
        });

        return [...orders];
      }),
      startWith(orders)
    );
  }

  private getFundingFees(orders: OrderItemData[]): Observable<Map<string, BigNumber>> {
    const existFees: string[] = Array.from(this.cachedFundingFee.keys());
    const ids: string[] = orders.filter(one => one.orderStatus !== 'PENDING').map(one => one.id);

    const newIds: string[] = _.difference(ids, existFees);
    if (newIds.length > 0) {
      const needFetchOrders: OrderItemData[] = orders.filter(one => newIds.indexOf(one.id) >= 0);
      const obs: Observable<OrderRealtimeInfo>[] = needFetchOrders.map(one => {
        return contractAccessor.getOrderInfo(one.id, one.quoteSymbol);
      });

      const rs = new AsyncSubject();
      merge(...obs)
        .pipe(
          tap((info: OrderRealtimeInfo) => {
            const fundingFee: BigNumber = info.lockedFee.add(info.newLockedFee);
            this.cachedFundingFee.set(info.orderId, fundingFee);
          }),
          finalize(() => {
            rs.next(true);
            rs.complete();
          })
        )
        .subscribe();

      return rs.pipe(mapTo(this.cachedFundingFee));
    } else {
      return of(this.cachedFundingFee);
    }
  }

  private watchCurPrices(items: OrderItemData[]): Observable<[symbol, BigNumber]> {
    const pairs: symbol[] = _.uniq(items.map(one => one.pairSymbol));

    const obs: Observable<[symbol, BigNumber]>[] = pairs.map(pair =>
      S.Trade.Price[pair.description as keyof typeof TRADE_PAIR_SYMBOL].watch().pipe(map(price => [pair, price]))
    );

    return merge(...obs);
  }
}
