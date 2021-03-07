import { orders, balance, infoItems, curPrice, poolInfo } from './mock/trade.mock';
import {graphData} from './mock/trade-graph.mock';
/**
 * Trade Page
 */

const returnVal: any= (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(val);
    }, Math.random()* 2000);
  })
}

export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return returnVal(balance);
};

export const getTradeOrders = async (page: number, pageSize = 10): Promise<ITradeRecord[]> => {
  return returnVal(orders);
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return returnVal(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradePoolInfo> => {
  return returnVal(poolInfo);
};

export const deposit = async (amount: IRecord): Promise<boolean> => {
  return returnVal(true);
};

export const withdraw = async (amount: IRecord): Promise<boolean> => {
  return returnVal(true);
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return returnVal(curPrice);
};

export const openOrder = async (orderParam: ITradeOpenParam): Promise<boolean> => {
  return returnVal(true);
};

export const getPriceGraphData = (duration: IGraphDuration): Promise<IPriceGraph> => {
  return returnVal(graphData);
}
/**
 * Pool Page
 */
