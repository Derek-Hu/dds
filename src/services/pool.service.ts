import { liquidityProvided } from './mock/pool.mock';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { BigNumber } from 'ethers';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { curUserAccount, loginUserAccount } from './account';
import { EMPTY, from, Observable, of, zip } from 'rxjs';
import { withLoading } from './utils';
import { defaultPoolData } from './mock/unlogin-default';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getCollaborativeLiquidityProvided = async (): Promise<ICoinValue[]> => {
  return returnVal(liquidityProvided);
};

export const getCollaborativeArp = async (): Promise<number> => {
  return returnVal(1002);
};

/** Done */
export const getPoolBalance = async (type: 'public' | 'private'): Promise<ICoinItem[]> => {
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
          return defaultPoolData;
        }

        return Array.from(balances.keys()).map((coin: IUSDCoins) => {
          return {
            coin,
            amount: Number(toEthers(balances.get(coin) as BigNumber, 4)),
          };
        });
      }),
      take(1)
    )
    .toPromise();
};

export const getPoolWithDrawDeadline = async (type: 'public' | 'private'): Promise<number> => {
  return returnVal(new Date().getTime());
};

/** Done */
export const getCollaborativeShareInPool = async (): Promise<IPoolShareInPool[]> => {
  const getShareInPool = (account: string): Observable<IPoolShareInPool[]> => {
    return zip(contractAccessor.pubPoolBalanceOf(account), contractAccessor.pubPoolBalanceWhole()).pipe(
      map((rs: Map<IUSDCoins, BigNumber>[]) => {
        return Array.from(rs[0].keys()).map((coin) => {
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
        return Array.from(rs[0].keys()).map((coin) => {
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
