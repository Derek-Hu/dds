import { liquidityProvided } from './mock/pool.mock';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { BigNumber } from 'ethers';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { curUserAccount, loginUserAccount } from './account';
import { from, Observable, of, zip } from 'rxjs';
import { withLoading } from './utils';
import { defaultCoinDatas, defaultPoolData } from './mock/unlogin-default';
import { PrivateLockLiquidity } from '../wallet/contract-interface';
import { CentralHost, DefaultNetwork } from '../constant';
import * as request from 'superagent';
import { Response } from 'superagent';
import { IOrderInfoData, OrderInfoObject } from './centralization-data';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  if(process.env.NODE_ENV === 'development'){
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
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        if (account === null && type === 'public') {
          return contractAccessor.pubPoolBalanceWhole();
        } else if (account !== null) {
          if (type === 'public') {
            return contractAccessor.pubPoolBalanceOf(account);
          } else {
            return contractAccessor.priPoolBalanceOf(account);
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
    return zip(contractAccessor.priPoolBalanceOf(account), contractAccessor.priPoolBalanceWhole()).pipe(
      map((rs: Map<IUSDCoins, BigNumber>[]) => {
        return Array.from(rs[0].keys()).map(coin => {
          const amount = Number(toEthers(rs[0].get(coin) as BigNumber, 4));
          const total = Number(toEthers(rs[1].get(coin) as BigNumber, 4));
          return { coin, amount, total };
        });
      })
    );
  };

  return from(curUserAccount())
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
  return await withLoading(contractAccessor.provideToPubPool(coin, amount).pipe(take(1)).toPromise());
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
  return withLoading(contractAccessor.provideToPrivatePool(coin, amount).pipe(take(1)).toPromise());
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
  devTest = false
): Promise<PrivatePoolOrder[]> => {
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        const baseHost = 'http://' + CentralHost + '/' + DefaultNetwork;
        const url: string = baseHost + '/transactions/getTransactionsInfo';
        const pageIndex = page - 1;
        return request.post(url).send({
          page: pageIndex,
          offset: pageSize,
          state: 1,
          address: account, //"0xbfce8288fF225188EEC741aBfaac6BC9163d7a2B",
          name: 'maker',
        });
      }),
      map((res: Response) => {
        if (res.body.code === 200 && res.body.msg.length > 0) {
          const orders: IOrderInfoData[] = res.body.msg;
          return orders.map(one => new OrderInfoObject(one).getMakerOrder());
        } else {
          return [];
        }
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
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return contractAccessor.getPubPoolWithdrawDate(account);
      }),
      take(1)
    )
    .toPromise();
};
