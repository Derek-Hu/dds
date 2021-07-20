import { DatabaseStateMerger } from '../../interface';
import { asyncScheduler, from, merge, NEVER, Observable, of } from 'rxjs';
import { OrderItemData } from '../../state-types';
import { EthNetwork } from '../../../constant/network';
import { DatabaseUrl } from '../../../constant/address';
import * as request from 'superagent';
import { map, startWith, switchMap } from 'rxjs/operators';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';
import { TRADE_PAIR_SYMBOL_MAP, TRADE_PAIR_SYMBOL, getPairTokenSymbols } from '../../../constant/tokens';
import _ from 'lodash';
import { BigNumber } from 'ethers';
import { S } from '../../contract/contract-state-parser';
import { toEtherNumber } from '../../../util/ethers';
import { C } from 'state-manager/cache/cache-state-parser';

// address, network, pageIndex, pageSize, PendingOrders
type Args = [string, EthNetwork, number, number];
type ArgObject = {
  address: string;
  network: EthNetwork;
  pageIndex: number;
  pageSize: number;
};

function argConverter(args: Args): ArgObject {
  return {
    address: args[0],
    network: args[1],
    pageIndex: args[2],
    pageSize: args[3],
  } as ArgObject;
}

export class ActiveOrdersMerger implements DatabaseStateMerger<OrderItemData[], Args> {
  private cachedFundingFee = new Map<string, BigNumber>();

  /**
   * get and merge
   * maybe send results multi-times.
   * @param args
   */
  public mergeWatch(...args: Args): Observable<OrderItemData[]> {
    const argObj: ArgObject = argConverter(args);

    return this.doGet(argObj).pipe(
      switchMap((confirmed: OrderItemData[]) => {
        return this.doMergePending(confirmed);
      }),
      switchMap((pendingMerged: OrderItemData[]) => {
        return this.doMergePnl(pendingMerged);
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

  private doMergePending(confirmed: OrderItemData[]) {
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

  /**
   * get confirmed and active orders
   * @param argObj
   */
  private doGet(argObj: ArgObject): Observable<OrderItemData[]> {
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
        return orderInfos.map(one => this.convertToRowItem(one));
      })
    );
  }

  private doMergePnl(orders: OrderItemData[]): Observable<OrderItemData[]> {
    return this.watchCurPrices(orders).pipe(
      map(([pair, price]) => {
        orders
          .filter(one => one.orderStatus !== 'PENDING')
          .filter(one => one.pairSymbol === pair)
          .forEach(one => {
            const { pnl, percent } = this.computePNL(price, one.openPrice, one.pairSymbol);
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
      // TODO get the funding fee by order id from blockchain
      return NEVER;
    } else {
      return of(this.cachedFundingFee);
    }
  }

  private convertToRowItem(orderInfoData: OrderInfoObject): OrderItemData {
    return {
      id: orderInfoData.orderId.toString(),
      hash: orderInfoData.createHash,
      network: orderInfoData.network,
      takerAddress: orderInfoData.takerAddress,
      openTime: orderInfoData.openTime,
      openAmount: orderInfoData.openAmount.value,
      openPrice: orderInfoData.openPrice.value,
      closePrice: orderInfoData.closePrice.value,
      pairSymbol: TRADE_PAIR_SYMBOL_MAP.get(orderInfoData.orderInfoData.symbol),
      fundingFee: orderInfoData.lockFee.value,
      settlementFee: orderInfoData.exFee.value,
      orderStatus: orderInfoData.status,
      positionPNLVal: null,
      positionPNLPercent: null,
    } as OrderItemData;
  }

  private computePNL(curPrice: BigNumber, openPrice: BigNumber, pair: symbol): { pnl: number; percent: number } {
    const quote: symbol = getPairTokenSymbols(pair)?.quote as symbol;
    const delta: BigNumber = curPrice.sub(openPrice);
    const open: number = Number(toEtherNumber(openPrice, 2, quote));
    const pnl = Number(toEtherNumber(delta, 2, quote));
    const pnlPercent = Number(((pnl * 100) / open).toFixed(2));

    return { pnl, percent: pnlPercent };
  }

  private watchCurPrices(items: OrderItemData[]): Observable<[symbol, BigNumber]> {
    const pairs: symbol[] = _.uniq(items.map(one => one.pairSymbol));

    const obs: Observable<[symbol, BigNumber]>[] = pairs.map(pair =>
      S.Trade.Price[pair.description as keyof typeof TRADE_PAIR_SYMBOL].watch().pipe(map(price => [pair, price]))
    );

    return merge(...obs);
  }
}
