import { orders, balance, infoItems, curPrice, poolInfo } from './mock/trade.mock';
import { walletManager } from '../wallet/wallet-manager';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { AsyncSubject, from, of, zip } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { ConfirmInfo, UserAccountInfo } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';
import { ETH_WEI, toEthers } from '../util/ethers';
import * as request from 'superagent';
import { Response } from 'superagent';
import { withLoading } from './utils';
import { CentralHost, DefaultNetwork } from '../constant';
import { loginUserAccount } from './account';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';

/**
 * Trade Page
 */

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      filter(wallet => wallet !== null),
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      filter(userAddress => userAddress !== null),
      switchMap((userAddress: string | null) => {
        return userAddress === null ? of(null) : contractAccessor.watchUserAccount(userAddress, coin);
      }),
      filter(account => account !== null),
      map(
        (accountInfo: UserAccountInfo | null): IBalanceInfo => {
          if (accountInfo === null) {
            return {
              balance: -1,
              locked: 0,
            };
          } else {
            const deposit: BigNumber = accountInfo.deposit;
            const availed: BigNumber = accountInfo.available;
            const locked: BigNumber = deposit.sub(availed);

            return {
              balance: Number(toEthers(deposit, 4)),
              locked: Number(toEthers(locked, 4)),
              available: Number(toEthers(availed, 4)),
            } as IBalanceInfo;
          }
        }
      ),
      take(1)
    )
    .toPromise();
};

export const getMaxOpenAmount = async (
  coin: IUSDCoins,
  exchange: IExchangePair,
  availedAmount: number
): Promise<number> => {
  return contractAccessor
    .getMaxOpenAmount(coin, exchange, availedAmount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 0))),
      take(1)
    )
    .toPromise();
};

// 订单确认弹框中funding lock的值
export const getFundingLocked = async (coin: IUSDCoins, ethAmount: number): Promise<number> => {
  return contractAccessor
    .getFundingLockedAmount(coin, 'ETHDAI', ethAmount)
    .pipe(
      map((locked: BigNumber) => {
        return Number(toEthers(locked, 4));
      }),
      take(1)
    )
    .toPromise();
};

/**
 * 获取交易订单
 *
 * @param page
 * @param pageSize
 */
export const getTradeOrders = async (page: number, pageSize = 5, isActive = true): Promise<ITradeRecord[]> => {
  // if (process.env.NODE_ENV === 'development') {
  //   return returnVal([
  //     {
  //       id: 'string',
  //       time: new Date().getTime(),
  //       type: 'LONG',
  //       price: 60,
  //       // openPrice: number;
  //       // curPrice: number;
  //       amount: 50,
  //       cost: 40,
  //       costCoin: 'DAI',
  //       fee: 30,
  //       pl: {
  //         val: 100,
  //         percentage: 20,
  //       },
  //       status: 'ACTIVE',
  //     },
  //     {
  //       id: 'string',
  //       time: new Date().getTime(),
  //       type: 'SHORT',
  //       price: 60,
  //       // openPrice: number;
  //       // curPrice: number;
  //       amount: 50,
  //       cost: 40,
  //       costCoin: 'DAI',
  //       fee: 30,
  //       pl: {
  //         val: 100,
  //         percentage: 20,
  //       },
  //       status: 'ACTIVE',
  //     },
  //   ]);
  // }
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        const baseHost = 'http://' + CentralHost + '/' + DefaultNetwork;
        const url: string = baseHost + '/transactions/getTransactionsInfo';
        const pageIndex = page - 1;
        const state = isActive ? 1 : 2; // 1:未平仓，2：已平仓
        return request.post(url).send({ page: pageIndex, offset: pageSize, state, address: account, name: 'taker' });
      }),
      switchMap((res: Response) => {
        if (res.body.code === 200 && res.body.msg.length > 0) {
          return contractAccessor.getPriceByETHDAI('DAI').pipe(
            map((curPrice: BigNumber) => {
              return {
                value: curPrice,
                precision: ETH_WEI,
              } as CoinNumber;
            }),
            map((curPrice: CoinNumber) => {
              const orders: IOrderInfoData[] = res.body.msg;
              return orders.map(
                (o: IOrderInfoData): ITradeRecord => {
                  return new OrderInfoObject(o).getTakerOrder(curPrice);
                }
              );
            })
          );
        } else {
          return of([]);
        }
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      }),
      take(1)
    )
    .toPromise();
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return returnVal(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradePoolInfo> => {
  // if(process.env.NODE_ENV === 'development'){
  //   return returnVal({
  //     public: {
  //       value: 3243,
  //       total: 10000,
  //     },
  //     private: {
  //       value: 100,
  //       total: 10000,
  //     }
  //   })
  // }
  const obs = [contractAccessor.getPubPoolInfo(coin), contractAccessor.getPrivatePoolInfo(coin)];
  return zip(...obs)
    .pipe(
      map((infoList: CoinAvailableInfo[]) => {
        return {
          public: infoList[0],
          private: infoList[1],
        };
      }),
      take(1)
    )
    .toPromise();
};

export const deposit = async (amount: IRecord): Promise<boolean> => {
  const result: Promise<boolean> = from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.depositToken(account, amount.amount, amount.coin);
      }),
      take(1)
    )
    .toPromise();

  return withLoading(result);
};

export const withdraw = async (amount: IRecord): Promise<boolean> => {
  return withLoading(contractAccessor.withdrawToken(amount.amount, amount.coin).pipe(take(1)).toPromise());
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return contractAccessor
    .getPriceByETHDAI(coin)
    .pipe(
      map(num => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

/**
 * 开仓下单操作
 * @param coin -
 * @param tradeType
 * @param amount - eth的数量
 */
export const openOrder = async (coin: IUSDCoins, tradeType: ITradeType, amount: number): Promise<boolean> => {
  const inviteAddress: string | null = localStorage.getItem('referalCode');
  return withLoading(contractAccessor.createContract(coin, tradeType, amount, inviteAddress).pipe(take(1)).toPromise());
};

/**
 * 关仓操作
 * @param order - 订单对象，从返回的order列表中选取
 * @param closePrice - 用户看到并认可的的此刻价格
 */
export const closeOrder = async (order: ITradeRecord, closePrice: number): Promise<boolean> => {
  return withLoading(contractAccessor.closeContract(order, closePrice).pipe(take(1)).toPromise());
};

export const getPriceGraphData = (
  coins: { from: IFromCoins; to: IUSDCoins },
  duration: IGraphDuration
): Promise<IPriceGraph> => {
  const days = duration === 'day' ? 1 : duration === 'week' ? 7 : 30;

  const rs = new AsyncSubject<IPriceGraph>();
  request
    .get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=USD&days=' + days)
    .end((err, res) => {
      if (!err) {
        const obj = JSON.parse(res.text);
        const data: { timestamp: number; value: number }[] = obj.prices.map((el: number[]) => ({
          timestamp: el[0],
          value: el[1],
        }));
        const last: number = data[data.length - 1].value;
        const dataRs = {
          price: last,
          percentage: -14.2,
          range: 23,
          data: data,
        };
        rs.next(dataRs);
        rs.complete();
      }
    });
  return rs.toPromise();
};

/**
 * 订单确认页面显示数值
 * @param amount - eth amount
 * @param coin - DAI
 */
export const confirmOrder = async (amount: number, coin: IUSDCoins): Promise<IOpenFee> => {
  return contractAccessor
    .confirmContract(amount, coin)
    .pipe(
      map((info: ConfirmInfo) => {
        return {
          curPrice: Number(toEthers(info.currentPrice, 4, coin)),
          settlementFee: Number(toEthers(info.exchgFee, 6, coin)),
          fundingFeeLocked: Number(toEthers(info.openFee, 6, coin)),
        };
      }),
      take(1)
    )
    .toPromise();
};
