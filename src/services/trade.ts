import { orders, balance, infoItems, curPrice } from './mock/trade.mock';

/**
 * Trade Page
 */
export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return Promise.resolve(balance);
};

export const getTradeOrders = async (page: number, pageSize = 10): Promise<ITradeRecord[]> => {
  return Promise.resolve(orders);
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return Promise.resolve(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return Promise.resolve(infoItems);
};

export const deposit = async (amount: IRecord): Promise<boolean> => {
  return Promise.resolve(true);
};

export const withdraw = async (amount: IRecord): Promise<boolean> => {
  return Promise.resolve(true);
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return Promise.resolve(curPrice);
};

export const openOrder = async (orderParam: ITradeOpenParam): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * Pool Page
 */
