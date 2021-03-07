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
