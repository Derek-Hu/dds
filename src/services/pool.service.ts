import { liquidityProvided } from './mock/pool.mock';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getCollaborativeLiquidityProvided = async (): Promise<IPoolCoinAmount[]> => {
  return returnVal(liquidityProvided);
};


export const getCollaborativeArp = async (): Promise<number> => {
  return returnVal(1002);
};

export const getCollaborativeDepositRe = async ({amount, coin }: { coin: IUSDCoins; amount: number }): Promise<number> => {
  return returnVal(Math.random() * 10000);
};


export const doCollaborativeDeposit = async ({amount, reAmount, coin }: { coin: IUSDCoins; amount: number, reAmount: number}): Promise<number> => {
  return returnVal(Math.random() * 10000);
};
