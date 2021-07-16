import CryptoJS from 'crypto-js';
import { loginUserAccount } from './account';
import { firstValueFrom, from, zip } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { withLoading } from './utils';
import { CoinBalance } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

function confirmLevel(rank: number): 'A' | 'B' | 'C' | 'D' {
  return rank > 0 && rank <= 20 ? 'A' : rank >= 21 && rank <= 50 ? 'B' : rank >= 51 && rank <= 100 ? 'C' : 'D';
}

function confirmLevelReward(total: BigNumber, level: 'A' | 'B' | 'C' | 'D'): BigNumber {
  if (level === 'C' || level === 'D') {
    return BigNumber.from(0);
  } else if (level === 'B') {
    return total.div(75); // total * 0.4 / 30
  } else if (level === 'A') {
    return total.mul(3).div(100); // total * 0.6 / 20
  } else {
    return BigNumber.from(0);
  }
}

export const account2ReferalCode = (address: string) => {
  if (!address) {
    return '';
  }
  return CryptoJS.AES.encrypt(address.replace(/^0x/i, ''), '0x').toString();
};
export const getSparkData = async (): Promise<IBrokerSpark> => {
  return returnVal({
    commission: 40,
    bonus: 98247489,
    referals: 9824,
  });
};

export const getMyReferalInfo = async (): Promise<IBrokerReferal> => {
  const res = from(loginUserAccount()).pipe(
    switchMap(account => {
      return contractAccessor.getBrokerInfo(account);
    }),
    map(rs => {
      const total = rs.claim.map(one => Number(toEthers(one.balance, 4, one.coin))).reduce((acc, cur) => acc + cur, 0);
      const refer = rs.refer.toNumber();
      const rank: number = rs.rank.toNumber();
      const level = confirmLevel(rank);

      const rankStr: string = rank === 0 || rank > 100 ? '100+' : rank.toString();

      return {
        bonus: total,
        referals: refer,
        level,
        ranking: rankStr,
      };
    }),
    take(1)
  );
  return firstValueFrom(res);
};

export const claimReferalInfo = async (): Promise<boolean> => {
  return withLoading(
    firstValueFrom(
      from(loginUserAccount()).pipe(
        switchMap(account => {
          return contractAccessor.doBrokerClaim();
        }),
        take(1)
      )
    )
  );
};

// 获取broker活动累计奖励信息 new 4.18
export const getBrokerCampaignRewardData = async (): Promise<ICoinItem[]> => {
  const res = from(loginUserAccount()).pipe(
    switchMap(account => {
      return contractAccessor.getBrokerMonthlyAwardsInfo(account);
    }),
    map((balances: CoinBalance[]) => {
      return balances.map(one => {
        return {
          coin: one.coin,
          amount: Number(toEthers(one.balance, 2, one.coin)),
        } as ICoinItem;
      });
    }),
    take(1)
  );
  return firstValueFrom(res);
};

// 获取Broker活动当月奖金池信息
export const getBrokerCampaignPool = async (): Promise<{ nextDistribution: string; data: ICoinItem[] }> => {
  const res = from(loginUserAccount()).pipe(
    switchMap(account => {
      const total$ = contractAccessor.getBrokerMonthlyRewardPool();
      const rank$ = contractAccessor.getBrokerInfo(account).pipe(map(rs => rs.rank));

      return zip(total$, rank$);
    }),
    switchMap(([total, rank]) => {
      const data = total.map(balance => {
        const selfReward: BigNumber = confirmLevelReward(balance.balance, confirmLevel(rank.toNumber()));
        return {
          coin: balance.coin,
          amount: Number(toEthers(selfReward, 2, balance.coin)),
          total: Number(toEthers(balance.balance, 2, balance.coin)),
        } as ICoinItem;
      });

      return contractAccessor.getBrokerMonthlyStartTime().pipe(
        map(timestamp => {
          const nextDate = new Date(timestamp + 30 * 24 * 3600 * 1000);
          return {
            data,
            nextDistribution: nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate(),
          };
        })
      );
    }),
    take(1)
  );
  return firstValueFrom(res);
};

export const getBrokerCampaignRewardsPool = async (): Promise<IBrokerCampaignRecord[]> => {
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

// 获取当前活动周期的开始时间 new 4.18
export const getBrokerCampaignCurCycleStartTime = async (): Promise<number> => {
  return firstValueFrom(contractAccessor.getBrokerMonthlyStartTime().pipe(take(1)));
};

export const getBrokerCommissionData = async (): Promise<ICoinValue[]> => {
  const res = from(loginUserAccount()).pipe(
    switchMap(account => {
      return contractAccessor.getBrokerAllCommission(account);
    }),
    map((rs: CoinBalance[]) => {
      return rs.map(one => ({ coin: one.coin, value: Number(toEthers(one.balance, 4, one.coin)) } as ICoinValue));
    }),
    take(1)
  );
  return firstValueFrom(res);
};

export const getBrokerCommissionRecords = async (): Promise<IBrokerCommissionRecord[]> => {
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
