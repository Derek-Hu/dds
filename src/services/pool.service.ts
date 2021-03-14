import { liquidityProvided } from './mock/pool.mock';
import Mask from '../components/mask';
import { contractAccessor } from '../wallet/chain-access';
import { toEthers } from '../util/ethers';
import { BigNumber } from 'ethers';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { curUserAccount } from './account';
import { from, zip } from 'rxjs';

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

export const getPoolBalance = async (type: 'public' | 'private'): Promise<ICoinItem[]> => {
  return from(curUserAccount())
    .pipe(
      switchMap((account: string | null) => {
        // 有效登陆状态下返回个人余额
        if (account !== null && type === 'private') {
          return contractAccessor.pubPoolBalanceOf(account);
        } else {
          // 未登录返回总体余额
          return contractAccessor.pubPoolBalanceWhole();
        }
      }),
      map((balances) => {
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

export const getCollaborativeShareInPool = async (): Promise<IPoolShareInPool[]> => {
  return from(curUserAccount())
    .pipe(
      filter((account) => account !== null),
      map((account) => account as string),
      switchMap((account: string) => {
        return zip(contractAccessor.pubPoolBalanceOf(account), contractAccessor.pubPoolBalanceWhole());
      }),
      map((rs: Map<IUSDCoins, BigNumber>[]) => {
        return Array.from(rs[0].keys()).map((coin) => {
          const amount = Number(toEthers(rs[0].get(coin) as BigNumber, 4));
          const total = Number(toEthers(rs[1].get(coin) as BigNumber, 4));
          return { coin, amount, total };
        });
      }),
      take(1)
    )
    .toPromise();
};

export const getPrivateSharePool = async (): Promise<ICoinItem[]> => {
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

export const getCollaborativeWithdrawRe = async ({ amount, coin }: IRecord): Promise<number> => {
  return contractAccessor
    .getPubPoolWithdrawReTokenFromToken(coin, amount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

export const doCollaborativeDeposit = async ({
  amount,
  reAmount,
  coin,
}: {
  coin: IUSDCoins;
  amount: number;
  reAmount: number;
}): Promise<boolean> => {
  Mask.showLoading();
  const isSuccess = await contractAccessor.provideToPubPool(coin, amount).pipe(take(1)).toPromise();;
  if(isSuccess){
    Mask.showSuccess();
  }else{
    Mask.showFail();
  }
  return isSuccess;
};

export const doPrivateDeposit = async ({amount, coin }: { coin: any; amount: any }): Promise<boolean> => {
  Mask.showLoading();
  const isSuccess = await returnVal(false);
  if(isSuccess){
    Mask.showSuccess();
  }else{
    Mask.showFail();
  }
  return isSuccess;
};

export const doPoolWithdraw = async ({amount, coin, type }: { coin: any; amount: any, type: 'public' | 'private' }): Promise<boolean> => {
  Mask.showLoading();
  const isSuccess = await returnVal(false);
  if(isSuccess){
    Mask.showSuccess();
  }else{
    Mask.showFail();
  }
  return isSuccess;
}
export const doCollaborativeWithdraw = async ({
  coin,
  reAmount,
}: {
  coin: IUSDCoins;
  reAmount: number;
}): Promise<boolean> => {
  return contractAccessor.withdrawFromPubPool(coin, reAmount).pipe(take(1)).toPromise();
};


