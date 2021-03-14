import { liquidityProvided } from './mock/pool.mock';
import Mask from '../components/mask';

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

export const getPoolBalance = async (type: 'public'|'private'): Promise<ICoinItem[]> => {
  return returnVal([{
    coin: 'USDC',
    amount: Math.random() * 10000,
  },{
    coin: 'USDT',
    amount: Math.random() * 10000,
  },{
    coin: 'DAI',
    amount: Math.random() * 10000,
  }]);
};

export const getPoolWithDrawDeadline = async (type: 'public'|'private'): Promise<number> => {
  return returnVal(new Date().getTime());
};


export const getCollaborativeShareInPool = async () : Promise<IPoolShareInPool[]> => {
  return returnVal([{
    coin: 'USDC',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'USDT',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'DAI',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  }]);
};

export const getPrivateSharePool = async () : Promise<ICoinItem[]> => {
  return returnVal([{
    coin: 'USDC',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'USDT',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'DAI',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  }]);
};

export const getUnloginPrivateSharePool = async () : Promise<ICoinItem[]> => {
  return returnVal([{
    coin: 'USDC',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'USDT',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  },{
    coin: 'DAI',
    amount: Math.random() * 1000,
    total: Math.random() * 10000
  }]);
};

export const getCollaborativeDepositRe = async ({amount, coin }: { coin: IUSDCoins; amount: number }): Promise<number> => {
  return returnVal(Math.random() * 10000);
};


export const doCollaborativeDeposit = async ({amount, reAmount, coin }: { coin: IUSDCoins; amount: number, reAmount: number}): Promise<boolean> => {
  Mask.showLoading();
  const isSuccess = await returnVal(false);
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
};


