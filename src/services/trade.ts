import { orders, balance, infoItems } from './mock/trade.mock';

/**
 * Trade Page
 */
export const getFundingBalanceInfo = async (): Promise<IBalanceInfo> => {
    return Promise.resolve(balance);
};

export const getTradeOrders = async (page: number, pageSize = 10): Promise<ITradeRecord[]> => {
    return Promise.resolve(orders);
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
    return Promise.resolve(infoItems);
}

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
    return Promise.resolve(infoItems);
}

/**
 * Pool Page
 */