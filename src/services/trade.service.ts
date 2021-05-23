import { infoItems } from './mock/trade.mock';
import { walletManager } from '../wallet/wallet-manager';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { AsyncSubject, from, Observable, of, zip } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { ConfirmInfo, UserAccountInfo } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';
import { ETH_WEI, toEthers, toExchangePair } from '../util/ethers';
import * as request from 'superagent';
import { withLoading } from './utils';
import { getNetworkAndAccount, loginUserAccount } from './account';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';
import { CentralHost, CentralPath, CentralPort, CentralProto, EthNetwork } from '../constant/address';

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
  // return returnVal({
  //   balance: 10000,
  //   locked: 0,
  // })
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
  exchangeStr: IExchangeStr,
  availedAmount: number | undefined,
  type: ITradeType
): Promise<number> => {
  const exchange: ExchangeCoinPair = toExchangePair(exchangeStr);
  const amount: number = availedAmount === undefined ? 0 : availedAmount;

  return contractAccessor
    .getMaxOpenTradeAmount(exchange, type, amount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 2))),
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
  //       hash: '0.5520740463908274',
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
  //       hash: '20000',
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

  return from(getNetworkAndAccount())
    .pipe(
      switchMap(({ account, network }) => {
        const baseHost: string =
          CentralProto === 'https:'
            ? CentralHost + '/' + CentralPath[network]
            : CentralHost + ':' + CentralPort[network] + '/' + CentralPath[network];
        const url: string = baseHost + '/transactions/getTransactionsInfo';
        const pageIndex = page - 1;
        const state = isActive ? 1 : 2; // 1:未平仓，2：已平仓
        return from(
          request.post(url).send({ page: pageIndex, offset: pageSize, state, address: account, name: 'taker' })
        ).pipe(
          map(res => {
            return { res, network };
          })
        );
      }),
      switchMap(({ res, network }) => {
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
                  return new OrderInfoObject(o, network).getTakerOrder(curPrice);
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
  if (process.env.NODE_ENV === 'development') {
    return returnVal({
      public: {
        value: 100000000.12,
        total: 1234567890.1235,
      },
      private: {
        value: 10232003222,
        total: 30232003222,
      },
    });
  }
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
  // return returnVal(100);
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
  const res: Promise<string> = createOrder(coin, tradeType, amount);

  const toBoolean = (a: Promise<string>) =>
    from(a)
      .pipe(
        map(r => {
          return r.length > 0;
        })
      )
      .toPromise();

  return withLoading(toBoolean(res));
};

/**
 * 开仓下单操作
 * @param coin - 交易对
 * @param tradeType - 下单类型
 * @param amount  - eth的数量
 * @returns - 交易hash，如果下单失败，将返回空字符串 ''
 */
export const createOrder = async (coin: IUSDCoins, tradeType: ITradeType, amount: number): Promise<string> => {
  const inviteAddress: string | null = localStorage.getItem('referalCode');
  const slider = 1;
  const timeout = 15 * 60;
  // if(process.env.NODE_ENV === 'development'){
  //   return Promise.resolve(`${Math.random()}`);
  // }
  const res: Promise<string> = contractAccessor
    .createContract(coin, tradeType, amount, inviteAddress, slider, timeout)
    .pipe(take(1))
    .toPromise();

  return withLoading<string>(res, '');
};

/**
 * 关仓操作
 * @param order - 订单对象，从返回的order列表中选取
 */
export const closeOrder = async (order: ITradeRecord, closePrice: number): Promise<boolean> => {
  return withLoading(contractAccessor.closeContract(order).pipe(take(1)).toPromise());
};

const NetworkChains: Partial<Record<IFromCoins, INetworkChain>> = {
  BNB: 'binancecoin',
  ETH: 'ethereum',
};

export const getPriceGraphData = (
  coins: { from: IFromCoins; to: IUSDCoins },
  duration: IGraphDuration
): Promise<IPriceGraph> => {
  const network = NetworkChains[coins.from];
  const days = duration === 'day' ? 1 : duration === 'week' ? 7 : 30;
  const url = `https://api.coingecko.com/api/v3/coins/${network}/market_chart?vs_currency=USD&days=` + days;
  const rs = new AsyncSubject<IPriceGraph>();
  request.get(url).end((err, res) => {
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
    } else {
      rs.error(err);
    }
  });
  return rs.toPromise();
};

/**
 * 订单确认页面显示数值
 * @param amount - eth amount
 * @param coin - DAI
 */
export const confirmOrder = async (amount: number, coin: IUSDCoins, type: ITradeType): Promise<IOpenFee> => {
  // return returnVal({
  //   curPrice: 100,
  //   settlementFee: 1001,
  //   fundingFeeLocked: 0.2
  // });
  return contractAccessor
    .confirmContract('ETHDAI', amount, type)
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

const getOrderStatusFun = (hash: string): Observable<IOrderPendingResult> => {
  return from(getNetworkAndAccount()).pipe(
    switchMap(({ account, network }) => {
      const baseHost: string =
        CentralProto === 'https:'
          ? CentralHost + '/' + CentralPath[network]
          : CentralHost + ':' + CentralPort[network] + '/' + CentralPath[network];
      const url: string = baseHost + '/transactions/getTxState';

      return from(request.post(url).send({ txHash: hash })).pipe(
        map(res => {
          return 'pending' as IOrderPendingResult;
        })
      );
    }),
    take(1)
  );
};

/**
 * 获取pending状态的变化
 */
export const getOrderStatus = async (hash: string): Promise<IOrderPendingResult> => {
  return getOrderStatusFun(hash).toPromise();
};

/**
 *
 * @param hashArr
 */
export const getOrderListStatus = (hashArr: string[]): Observable<{ hash: string; status: IOrderPendingResult }[]> => {
  const obs = (one: string) =>
    getOrderStatusFun(one).pipe(
      map((status): { hash: string; status: IOrderPendingResult } => {
        return {
          hash: one,
          status,
        };
      })
    );

  return zip(hashArr.map(obs)).pipe(take(1));
};
