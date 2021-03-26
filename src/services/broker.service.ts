import CryptoJS from 'crypto-js';
import { loginUserAccount } from './account';
import { from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { withLoading } from './utils';
import { CoinBalance } from '../wallet/contract-interface';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

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
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.getBrokerInfo(account);
      }),
      map(rs => {
        const total = rs.claim
          .map(one => Number(toEthers(one.balance, 4, one.coin)))
          .reduce((acc, cur) => acc + cur, 0);
        const refer = rs.refer.toNumber();

        return {
          bonus: total,
          referals: refer,
          level: 'A',
          ranking: 39,
        };
      }),
      take(1)
    )
    .toPromise();
};

export const claimReferalInfo = async (): Promise<boolean> => {
  return withLoading(from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.doBrokerClaim();
      }),
      take(1)
    )
    .toPromise());
};

export const getBrokerCampaignRewardData = async (): Promise<ICoinValue[]> => {
  return returnVal([
    {
      coin: 'DAI',
      value: 2 * 10000000,
    },
    {
      coin: 'USDC',
      value: 3 * 10000000,
    },
    {
      coin: 'USDT',
      value: 4 * 10000000,
    },
  ]);
};

export const getBrokerCampaignPool = async (): Promise<{ nextDistribution: string; data: ICoinItem[] }> => {
  return returnVal({
    data: [
      {
        coin: 'USDT',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
      {
        coin: 'USDC',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
      {
        coin: 'DAI',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
    ],
    nextDistribution: '2020-02-10',
  });
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

export const getBrokerCommissionData = async (): Promise<ICoinValue[]> => {
  return from(loginUserAccount())
    .pipe(
      switchMap(account => {
        return contractAccessor.getBrokerAllCommission(account);
      }),
      map((rs: CoinBalance[]) => {
        return rs.map(one => ({ coin: one.coin, value: Number(toEthers(one.balance, 4, one.coin)) } as ICoinValue));
      }),
      take(1)
    )
    .toPromise();
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
