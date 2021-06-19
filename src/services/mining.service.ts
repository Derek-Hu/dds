import Mask from '../components/mask';
import { contractAccessor } from '../wallet/chain-access';
import { from, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';
import { getCurNetwork, loginUserAccount } from './account';
import {
  CoinBalance,
  CoinShare,
  LiquditorRewardsResult,
  PubPoolLockInfo,
  PubPoolRewards,
} from '../wallet/contract-interface';
import { defaultPoolData, defaultReTokenData } from './mock/unlogin-default';
import { withLoading } from './utils';
import { MyTokenSymbol } from '../constant';
import { ContractAddressByNetwork, EthNetwork } from '../constant/address';
import { PublicPoolLiquidityRewards, ReTokenAmounts } from './mining.service.interface';
import { queryMan } from '../wallet/state-manager';
import { log } from 'util';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

// 获取Top 3及用户排名  -- modified 05-09
export const getRankings = (): Promise<IRankings> => {
  return contractAccessor
    .getLiquiditorPeriod()
    .pipe(
      switchMap(period => {
        const periodVal = period.period.toNumber();

        const info$ = from(loginUserAccount()).pipe(
          switchMap((account: string) => {
            return contractAccessor.getLiquiditorRewardsOfPeriod(account, periodVal);
          }),
          map(info => {
            return info.info.rank.toNumber();
          })
        );
        const top$ = contractAccessor.getLiquiditorRatingList(periodVal);

        return zip(info$, top$);
      }),
      map(([current, top]) => {
        return { top, current };
      }),
      take(1)
    )
    .toPromise();
};
//
export const getLiquidityMiningReward = (
  type: 'public' | 'private'
): Promise<{
  amount: number;
  refactor: number;
}> => {
  const reward$: Observable<number> = from(loginUserAccount()).pipe(
    filter(account => account !== null),
    map(account => account as string),
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

/**
 * Lock reToken
 * @param reToken - reToken type
 * @param amount - reToken amount to be locked.
 */
export const lockReTokenForLiquidity = async (reToken: IReUSDCoins, amount: number): Promise<boolean> => {
  const reTokenAddress: string | null = getReTokenContractAddress(reToken);
  if (!reTokenAddress) {
    return Promise.resolve(false);
  }

  return contractAccessor.lockReTokenForLiquidity(reTokenAddress, amount).pipe(take(1)).toPromise();
};

/**
 *
 * @param reToken - reTokenType
 * @param amount - unlock amount
 */
export const unLockReTokenForLiquidity = async (reToken: IReUSDCoins, amount: number) => {
  const reTokenAddress: string | null = getReTokenContractAddress(reToken);
  if (!reTokenAddress) {
    return Promise.resolve(false);
  }

  return contractAccessor.unLockReTokenFromLiquidity(reTokenAddress, amount).pipe(take(1)).toPromise();
};

/**
 * get current locked reToken in Liquidity Pool
 */
export const queryLiquidityLockedReTokenAmount = async (): Promise<ReTokenAmounts> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return queryMan.getPubPoolLiquidityShareInfo(account);
      }),
      map((info: PubPoolLockInfo) => {
        return {
          reDAI: Number(toEthers(info.lockedReToken.reDAI, 2, 'reDAI')),
          reUSDT: Number(toEthers(info.lockedReToken.reUSDT, 2, 'reUSDT')),
          reUSDC: Number(toEthers(info.lockedReToken.reUSDC, 2, 'reUSDC')),
        };
      }),
      take(1)
    )
    .toPromise();
};

/**
 * get user share of public pool liquidity.
 */
export const queryLiquidityLockedReTokenShare = async (): Promise<number> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return queryMan.getPubPoolLiquidityShareInfo(account);
      }),
      map((info: PubPoolLockInfo) => {
        const lpToken: BigNumber = info.lpToken.lpDAI.add(info.lpToken.lpUSDT).add(info.lpToken.lpUSDC);
        const lpTotal: BigNumber = info.totalLpToken.lpDAI.add(info.totalLpToken.lpUSDT).add(info.totalLpToken.lpUSDC);

        const lpNum: number = Number(toEthers(lpToken, 8));
        const lpAll: number = Number(toEthers(lpTotal, 8));

        if (lpAll === 0) {
          return 0;
        } else {
          return (lpNum * 100) / lpAll;
        }
      }),
      take(1)
    )
    .toPromise();
};

/**
 * 获取用户钱包中reToken的数量
 */
export const queryUserReTokenBalance = (): Promise<ReTokenAmounts> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return contractAccessor.getUserSelfReTokenBalance(account);
      }),
      map((balances: CoinBalance[]) => {
        return balances.map(one => {
          return {
            coin: one.coin as IReUSDCoins,
            balance: Number(toEthers(one.balance, 2, one.coin)),
          };
        });
      }),
      map((balances: { coin: IReUSDCoins; balance: number }[]) => {
        return balances.reduce((rs, cur) => {
          rs[cur.coin] = cur.balance;
          return rs;
        }, {} as ReTokenAmounts);
      }),
      take(1)
    )
    .toPromise();
};

/**
 * get user rewards from public pool liquidity mining (locked reToken).
 */
export const queryReTokenLiquidityRewards = async (): Promise<PublicPoolLiquidityRewards> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return queryMan.getReTokenLiquidityReward(account);
      }),
      map((reward: PubPoolRewards) => {
        const all = reward.available.add(reward.vesting).add(reward.unactivated);
        return {
          available: Number(toEthers(reward.available, 2, 'SLD')),
          vesting: Number(toEthers(reward.vesting, 2, 'SLD')),
          unactivated: Number(toEthers(reward.unactivated, 2, 'SLD')),
          total: Number(toEthers(all, 2, 'SLD')),
        };
      }),
      take(1),
      catchError(err => {
        console.warn('error', err);
        return of({
          total: 0,
          available: 0,
          vesting: 0,
          unactivated: 0,
        });
      })
    )
    .toPromise();
};

function getReTokenContractAddress(reToken: IReUSDCoins): string | null {
  const network: EthNetwork | null = getCurNetwork();
  if (network) {
    switch (reToken) {
      case 'reDAI': {
        return ContractAddressByNetwork[network].Lp1DAIContract;
      }
      case 'reUSDC': {
        return ContractAddressByNetwork[network].Lp1USDCContract;
      }
      case 'reUSDT': {
        return ContractAddressByNetwork[network].Lp1USDTContract;
      }
      default: {
        return null;
      }
    }
  }

  return null;
}

/**
 * Claim liquidity rewards for public pool
 */
export const claimPubPoolReTokenRewards = async () => {
  return await withLoading(contractAccessor.claimRewardsForLP1().toPromise());
};

export const claimLiquidityLocked = async () => {
  return await withLoading(contractAccessor.claimRewardsForLP2().toPromise());
};

export const getLiquidityLockedReward = (type: 'public' | 'private'): Promise<number> => {
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
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

/**
 * Your Liquiditor Mining Rewards 4.26
 * Get compensated when insurance fund is empty
 * 累积收益
 */
export const getLiquiditorReward = (type: 'public' | 'private'): Promise<{ campaign: number; compensate: number }> => {
  return from(loginUserAccount())
    .pipe(
      switchMap((account: string) => {
        return contractAccessor.getLiquiditorRewards(account);
      }),
      map((balances: LiquditorRewardsResult) => {
        return {
          campaign: Number(toEthers(balances.campaign, 4, MyTokenSymbol)),
          compensate: Number(toEthers(balances.compensate, 4, MyTokenSymbol)),
        };
      }),
      take(1)
    )
    .toPromise();
};

// 获取清算者在当前周期中获得的奖励 new 4.18
export const getLiquiditorPeriodReward = (): Promise<ILiquiditorPeriodReward> => {
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.getLiquiditorPeriod().pipe(
          switchMap(period => {
            return contractAccessor.getLiquiditorRewardsOfPeriod(account, period.period.toNumber());
          })
        );
      }),
      map(rs => {
        return {
          rewards: rs.rewards.map(one => {
            return { coin: one.coin, value: Number(toEthers(one.balance, 4, one.coin)) } as ICoinValue;
          }),
          extSLD: Number(toEthers(rs.info.extSLD, 4, 'SLD')),
          rank: rs.info.rank.toNumber(),
        } as ILiquiditorPeriodReward;
      }),
      take(1)
    )
    .toPromise();
};

// 获取清算周期的信息 new 4.18
export const getLiqiditorPeriodInfo = (): Promise<{ startTime: number; period: number }> => {
  return contractAccessor
    .getLiquiditorPeriod()
    .pipe(
      map(({ startTime, period }) => {
        return {
          startTime: startTime.toNumber() * 1000,
          period: period.toNumber(),
        };
      }),
      take(1)
    )
    .toPromise();
};

export const getLiquidityReTokenBalance = (): Promise<ICoinValue[]> => {
  const getReTokenBalance = (account: string): Observable<ICoinValue[]> => {
    return contractAccessor.getReTokenBalance(account).pipe(
      map((balances: CoinBalance[]) => {
        return balances.map(one => {
          return {
            coin: one.coin,
            value: Number(toEthers(one.balance, 4)),
          };
        });
      })
    );
  };

  return from(loginUserAccount())
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
      map(balances => {
        return balances.map(one => {
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
  // return Promise.resolve([{
  //   coin: 'DAI',
  //   amount: 10000,
  //   total: 324324323,
  // },{
  //   coin: 'USDT',
  //   amount: 10000,
  //   total: 324324323,
  // }]);
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

  return from(loginUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        return account === null ? of(defaultPoolData) : getMiningShare(account);
      }),
      take(1)
    )
    .toPromise();
};
