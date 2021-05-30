import { liquidityProvided } from './mock/pool.mock';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { BigNumber } from 'ethers';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { getNetworkAndAccount, loginUserAccount } from './account';
import { from, Observable, of, zip } from 'rxjs';
import { withLoading } from './utils';
import { defaultCoinDatas, defaultPoolData } from './mock/unlogin-default';
import * as request from 'superagent';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';
import { CoinBalance } from '../wallet/contract-interface';
import { CentralHost, CentralPath, CentralPort, CentralProto } from '../constant/address';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(val);
      }, Math.random() * 2000);
    });
  }
};

export const getCollaborativeLiquidityProvided = async (): Promise<ICoinValue[]> => {
  return returnVal(liquidityProvided);
};

export const getCollaborativeArp = async (): Promise<number> => {
  return returnVal(1002);
};

/** Done */
export const getPoolBalance = async (type: 'public' | 'private'): Promise<{ [key in IUSDCoins]: number }> => {
  // if(process.env.NODE_ENV === 'development'){
  //   return returnVal({
  //     DAI: 2330,
  //     USDC: 2343,
  //     USDT: 8000
  //   })
  // }
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        if (account === null && type === 'public') {
          return contractAccessor.pubPoolBalanceWhole();
        } else if (account !== null) {
          if (type === 'public') {
            return contractAccessor.pubPoolBalanceOf(account);
          } else {
            return contractAccessor.priPoolUserBalance(account).pipe(
              map(rs => {
                const res = new Map<IUSDCoins, BigNumber>();
                rs.total.forEach(one => {
                  res.set(one.coin as IUSDCoins, one.balance);
                });
                return res;
              })
            );
          }
        } else {
          return of(null);
        }
      }),
      map((balances: Map<IUSDCoins, BigNumber> | null) => {
        if (balances === null) {
          return defaultCoinDatas;
        }

        return Array.from(balances.keys()).reduce(
          (total, coin: IUSDCoins) => {
            total[coin] = Number(toEthers(balances.get(coin) as BigNumber, 4));
            return total;
          },
          { ...defaultCoinDatas }
        );
      }),
      take(1)
    )
    .toPromise();
};

/** Done */
export const getCollaborativeShareInPool = async (): Promise<IPoolShareInPool[]> => {
  const getShareInPool = (account: string): Observable<IPoolShareInPool[]> => {
    return zip(contractAccessor.pubPoolBalanceOf(account), contractAccessor.pubPoolBalanceWhole()).pipe(
      map((rs: Map<IUSDCoins, BigNumber>[]) => {
        return Array.from(rs[0].keys()).map(coin => {
          const amount = Number(toEthers(rs[0].get(coin) as BigNumber, 4));
          const total = Number(toEthers(rs[1].get(coin) as BigNumber, 4));
          return { coin, amount, total };
        });
      })
    );
  };

  return from(loginUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        return account === null ? of(defaultPoolData) : getShareInPool(account);
      }),
      take(1)
    )
    .toPromise();
};

/** Done */
export const getPrivateSharePool = async (): Promise<ICoinItem[]> => {
  const getSharePool = (account: string): Observable<ICoinItem[]> => {
    return contractAccessor.priPoolUserBalance(account).pipe(
      map(rs => {
        return rs.total.map(one => {
          const availableNum: BigNumber = rs.available.filter(c => c.coin === one.coin)[0].balance;
          return {
            coin: one.coin as IUSDCoins,
            amount: Number(toEthers(availableNum, 4, one.coin)),
            total: Number(toEthers(one.balance, 4, one.coin)),
          } as ICoinItem;
        });
      })
    );
  };

  return from(loginUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        return account === null ? of(defaultPoolData) : getSharePool(account);
      }),
      take(1)
    )
    .toPromise();
};

export const getUnloginPrivateSharePool = async (): Promise<ICoinItem[]> => {
  return returnVal([
    {
      coin: 'USDC',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
    {
      coin: 'USDT',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
    {
      coin: 'DAI',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
  ]);
};

export const getCollaborativeDepositRe = async ({ amount, coin }: IRecord): Promise<number> => {
  return contractAccessor
    .getPubPoolDepositReTokenFromToken(coin, amount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

// 从公池取出时使用的dai到reDai的换算
export const getCollaborativeWithdrawRe = async ({ amount, coin }: IRecord): Promise<number> => {
  return contractAccessor
    .getPubPoolWithdrawReTokenFromToken(coin, amount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

/** Done */
export const doCollaborativeDeposit = async ({
  amount,
  coin,
}: {
  coin: IUSDCoins;
  amount: number;
}): Promise<boolean> => {
  const result: Promise<boolean> = from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.provideToPubPool(account, coin, amount);
      }),
      take(1)
    )
    .toPromise();
  return await withLoading(result);
};

export const doPoolWithdraw = async ({
  amount,
  reAmount,
  coin,
  type,
}: {
  reAmount?: number;
  coin: any;
  amount: any;
  type: 'public' | 'private';
}): Promise<boolean> => {
  if (type === 'public') {
    return doCollaborativeWithdraw({ coin, reAmount: reAmount! });
  }
  return doPrivateWithdraw({ coin, amount });
};
/**
 * 公池取出
 * @param coin - IUSDCoins
 * @param reAmount - 与coin对应的reToken的数量，通过上面getCollaborativeWithdrawRe计算获得
 */
export const doCollaborativeWithdraw = async ({
  coin,
  reAmount,
}: {
  coin: IUSDCoins;
  reAmount: number;
}): Promise<boolean> => {
  return withLoading(contractAccessor.withdrawFromPubPool(coin, reAmount).pipe(take(1)).toPromise());
};

/** Done */
/**
 * 向私池存入
 * @param coin - IUSDCoins
 * @param amount - DAI的数量
 */
export const doPrivateDeposit = async ({ coin, amount }: { coin: IUSDCoins; amount: number }): Promise<boolean> => {
  const result: Promise<boolean> = from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.provideToPrivatePool(account, coin, amount);
      }),
      take(1)
    )
    .toPromise();

  return withLoading(result);
};

/**
 * 私池取出
 * @param coin
 * @param amount
 */
export const doPrivateWithdraw = async ({ coin, amount }: { coin: IUSDCoins; amount: number }): Promise<boolean> => {
  return withLoading(contractAccessor.withdrawFromPrivatePool(coin, amount).pipe(take(1)).toPromise());
};

/**
 * 获取私池订单列表
 * devTest - 获取测试数据，正常用户可能没有数据
 */
export const getPrivateOrders = async (
  page: number,
  pageSize: number,
  isActive = true
): Promise<PrivatePoolOrder[]> => {
  // if(process.env.NODE_ENV === 'development'){
  //   return returnVal([{
  //     hash: 'string',
  //     orderId: '233',
  //     time: new Date().getTime(),
  //     amount: 3,
  //     lockedAmount: 2,
  //     status: 'ACTIVE',
  //     openPrice: 20,
  //     coin: 'DAI',
  //   }])
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
        const state = isActive ? 1 : 2;
        return from(
          request.post(url).send({
            page: pageIndex,
            offset: pageSize,
            state: state,
            address: account,
            name: 'maker',
          })
        ).pipe(
          map(res => {
            return { res, network };
          })
        );
      }),
      map(({ res, network }) => {
        if (res.body.code === 200 && res.body.msg.length > 0) {
          const orders: IOrderInfoData[] = res.body.msg;
          return orders.map(one => new OrderInfoObject(one, network).getMakerOrder());
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.warn('error when get private orders', err);
        return of([]);
      }),
      take(1)
    )
    .toPromise();
};

/**
 * 向私池订单补仓
 */
export const addPrivateOrderMargin = async (order: PrivatePoolOrder, amount: number): Promise<boolean> => {
  return withLoading(
    from(loginUserAccount())
      .pipe(
        switchMap((account: string) => {
          return contractAccessor.addMarginAmount(order.orderId, order.coin, amount);
        }),
        take(1)
      )
      .toPromise()
  );
};

/**
 * 返回公池中提取锁定的解锁时间戳
 */
export const getPubPoolWithdrawDeadline = async (): Promise<{ coin: IUSDCoins; time: number }[]> => {
  // if(process.env.NODE_ENV === 'development'){
  //   return returnVal({
  //     DAI: new Date().getTime() + 3430243,
  //     USDT: new Date().getTime() - 30243,
  //     USDC: new Date().getTime() - 330243,
  //   });
  // }
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return contractAccessor.getPubPoolWithdrawDate(account);
      }),
      take(1)
    )
    .toPromise();
};

/**
 * 获取私池流动性总余额以及最大可取余额
 *
 * @return - 三种USD稳定币的总余额以及最大可取余额
 */
export const getPrivateLiquidityBalance = async (): Promise<
  { [key in IUSDCoins]: { total: number; maxWithdraw: number } }
> => {
  // if(process.env.NODE_ENV === 'development'){
  //   return returnVal({
  //     DAI: { total: 100, maxWithdraw: 200 },
  //     USDT:{ total: 120, maxWithdraw: 121 },
  //     USDC: { total: 201, maxWithdraw: 202 },
  //   });
  // }
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.priPoolUserBalance(account);
      }),
      map(allBalances => {
        const res = {
          DAI: { total: 0, maxWithdraw: 0 },
          USDT: { total: 0, maxWithdraw: 0 },
          USDC: { total: 0, maxWithdraw: 0 },
        };
        allBalances.total.forEach((balance: CoinBalance) => {
          const coin: IUSDCoins = balance.coin as IUSDCoins;
          res[coin]['total'] = Number(toEthers(balance.balance, 4));
        });
        allBalances.available.forEach(balance => {
          const coin: IUSDCoins = balance.coin as IUSDCoins;
          res[coin]['maxWithdraw'] = Number(toEthers(balance.balance, 2));
        });

        return res;
      }),
      take(1)
    )
    .toPromise();
};
