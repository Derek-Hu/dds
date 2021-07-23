import { DatabaseStateMerger } from '../../interface';
import { OrderItemData } from '../../state-types';
import { from, Observable, of } from 'rxjs';
import { argConverter, ListArgObject, ListArgs } from './list-types';
import { DatabaseUrl } from '../../../constant/address';
import * as request from 'superagent';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';
import { computePositionPNL } from '../../../util/pnl';
import { toEtherNumber } from '../../../util/ethers';

export class HistoryOrdersMerger implements DatabaseStateMerger<OrderItemData[], ListArgs> {
  public mergeWatch(...args: ListArgs): Observable<OrderItemData[]> {
    const argObj: ListArgObject = argConverter(args);

    return this.doGet(argObj).pipe(
      switchMap((orders: OrderItemData[]) => {
        return this.doMergePNL(orders);
      })
    );
  }

  private doGet(argObj: ListArgObject): Observable<OrderItemData[]> {
    const url: string = DatabaseUrl[argObj.network];
    const allSize: number = (argObj.pageIndex + 1) * argObj.pageSize;
    const resObs: Promise<any> = request
      .post(url)
      .send({ page: 0, offset: allSize, state: '2', address: argObj.address, name: 'taker' });

    return from(resObs).pipe(
      map(res => {
        const records: IOrderInfoData[] = res.body.msg;
        return records.map(record => {
          return new OrderInfoObject(record, argObj.network);
        });
      }),
      map((orderInfos: OrderInfoObject[]) => {
        return orderInfos.map(one => one.toOrderItemData());
      }),
      catchError(err => {
        console.warn('Get history orders ERROR:', err);
        return of([]);
      })
    );
  }

  private doMergePNL(orders: OrderItemData[]): Observable<OrderItemData[]> {
    const mergedPnl: OrderItemData[] = orders.map(one => {
      const { pnl, percent } = computePositionPNL(one.openPrice, one.closePrice, one.openAmount, one.pairSymbol);
      const fundingFee: number = Number(toEtherNumber(one.fundingFee, 2, one.quoteSymbol));
      const profit: number = pnl - fundingFee;

      one.positionPNLVal = pnl;
      one.positionPNLPercent = percent;
      one.realizedProfit = profit;

      return one;
    });

    return of(mergedPnl);
  }
}
