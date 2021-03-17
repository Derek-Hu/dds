import Mask from '../components/mask';
import { contractAccessor } from '../wallet/chain-access';
import { curUserAccount, loginUserAccount } from './account';
import { from, Observable, of, zip } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';
import { CoinBalance, CoinShare } from '../wallet/contract-interface';
import { defaultPoolData, defaultReTokenData } from './mock/unlogin-default';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

//
export const getLiquidityMiningReward = (
  type: 'public' | 'private'
): Promise<{
  amount: number;
  refactor: number;
}> => {
  const reward$: Observable<number> = from(curUserAccount()).pipe(
    filter((account) => account !== null),
    map((account) => account as string),
    switchMap((account: string) => {
      return contractAccessor.getLiquidityMiningReward(account);
    }),
    map((re: BigNumber) => {
      return Number(toEthers(re, 4));
    })
  );

  const refactor$ = of(32893220);

  return zip(reward$, refactor$)
    .pipe(
      map((nums: [number, number]) => {
        return {
          amount: nums[0],
          refactor: nums[1],
        };
      }),
      take(1)
    )
    .toPromise();
};

export const claimLiquidity = async () => {
  Mask.showLoading();
  const isSuccess = await returnVal(false);
  if (isSuccess) {
    Mask.showSuccess();
  } else {
    Mask.showFail();
  }
  return isSuccess;
};

export const claimLiquidityLocked = async () => {
  Mask.showLoading();

  const isSuccess = await contractAccessor.claimRewardsForLP2().toPromise();
  if (isSuccess) {
    Mask.showSuccess();
  } else {
    Mask.showFail();
  }
  return isSuccess;
};

export const getLiquidityLockedReward = (type: 'public' | 'private'): Promise<number> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account) => {
        return contractAccessor.getActiveLiquidityRewards(account);
      }),
      map((re: BigNumber) => {
        return Number(toEthers(re, 4));
      }),
      take(1)
    )
    .toPromise();
};

export const getLiquiditorBalanceRecord = (): Promise<ILiquiditorBalanceRecord[]> => {
  return returnVal([
    {
      time: new Date().getTime(),
      pair: {
        from: 'ETH',
        to: 'DAI',
      },
      price: 32432,
      amount: 32,
      reward: 32,
    },
  ]);
};

export const getLiquiditorReward = (type: 'public' | 'private'): Promise<{ campaign: number; compensate: number }> => {
  return returnVal({
    campaign: Math.random() * 100000,
    compensate: Math.random() * 100000,
  });
};

export const getLiquidityReTokenBalance = (): Promise<ICoinValue[]> => {
  const getReTokenBalance = (account: string): Observable<ICoinValue[]> => {
    return contractAccessor.getReTokenBalance(account).pipe(
      map((balances: CoinBalance[]) => {
        return balances.map((one) => {
          return {
            coin: one.coin,
            value: Number(toEthers(one.balance, 4)),
          };
        });
      })
    );
  };

  return from(curUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        return account === null ? of(defaultReTokenData) : getReTokenBalance(account);
      }),
      take(1)
    )
    .toPromise();
};

export const getLiquiditorSystemBalance = (): Promise<ICoinValue[]> => {
  return contractAccessor
    .getSystemFundingBalance()
    .pipe(
      map((balances) => {
        return balances.map((one) => {
          return {
            coin: one.coin,
            value: Number(toEthers(one.balance, 4, one.coin)),
          };
        });
      }),
      take(1)
    )
    .toPromise();
};

export const getLiquidityMiningShare = (): Promise<ICoinItem[]> => {
  const getMiningShare = (account: string): Observable<ICoinItem[]> => {
    return contractAccessor.getLiquidityMiningShare(account).pipe(
      map((rs: any) => {
        return rs.map((one: CoinShare) => {
          return {
            coin: one.coin,
            amount: toEthers(one.value, 4),
            total: toEthers(one.total, 4),
          };
        });
      })
    );
  };

  return from(curUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        return account === null ? of(defaultPoolData) : getMiningShare(account);
      }),
      take(1)
    )
    .toPromise();
};
