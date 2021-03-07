/**
 * Funding Balance 下单入参
 */
declare interface ITradeOpenParam {
  amount: number;
  type: 'long' | 'short';
  referal: string;
  coin: IUSDCoins;
}

/**
 * Funding Balance 账户信息
 */
declare interface IBalanceInfo {
  balance: number;
  locked: number;
  available: number;
}

// Funding Balance Deposit
// 入参：
declare interface ICoinAmount {
  coin: IUSDCoins;
  amount: number;
}

declare type IUSDCoins = 'DAI' | 'USDT' | 'USDC';
// Funding Balance Withdraw
// 入参：
declare interface IRecord {
  coin: IUSDCoins;
  amount: number;
}

/**
 * Trade Order Status
 */
declare type IStatus = 'ACTIVE' | 'CLOSED';

/**
 * Trade Order 记录
 */
declare interface ITradeRecord {
  id: string;
  time: number;
  type: string;
  price: number;
  amount: number;
  cost: number;
  costCoin: string;
  fee: number;
  pl: {
    val: number;
    percentage: number;
  };
  status: IStatus;
}

declare interface PoolAvailableInfo {
  value: number;
  total: number;
}

/**
 * Trade Liquidity Pool
 */
declare interface ITradePoolInfo {
  public: PoolAvailableInfo;
  private: PoolAvailableInfo;
}

/**
 * Trade Page Info
 */
declare interface ITradeInfo {
  label: string;
  value: string;
}

/**
 * 行情图数据时间区间
 */
declare type IGraphDuration = 'day' | 'week' | 'month';
/**
 * 行情图数据
 */
declare interface IPriceGraph {
  price: number;
  percentage: number;
  range: number;
  data: Array<{
    value: number;
    timestamp: number;
  }>;
}

/*pool type*/
declare type IPoolType = 'public' | 'private';

declare interface PoolPercentInfo {
  DAI: PoolAvailableInfo;
  USDT: PoolAvailableInfo;
  USDC: PoolAvailableInfo;
}

declare interface PoolValueInfo {
  DAI: number;
  USDT: number;
  USDC: number;
}

declare interface PoolContractDetail {
  id: string;
  time: number;
  amount: number;
  locked: number;
  coin: IUSDCoins;
  fee: number;
  status: 'Closed' | 'Active';
}
