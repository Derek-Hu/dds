import { swapData } from './mock/swap.mock';

/**
 * 返回四个值，DAI,USDT,USDC 以及 dds的总量
 *
 */
export const swapAmount = async (): Promise<SwapValueInfo> => {
  return Promise.resolve(swapData);
};

/**
 * 兑换dds变成稳定币， dds amount，exchange type DAI/USDT/USDC
 */
export const swap = async (param: SwapParam): Promise<boolean> => {
  return Promise.resolve(true);
};
