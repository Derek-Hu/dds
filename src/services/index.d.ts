/**
 * Funding Balance 下单入参
 */
declare interface ITradeOpenParam {
  amount: number;
  type: 'long' | 'short';
  referal: string;
  coin: 'DAI' | 'USDT' | 'USDC';
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
declare interface IRecord {
  coin: 'DAI' | 'USDT' | 'USDC';
  amount: number;
}

declare type IUSDCoins = 'DAI' | 'USDT' | 'USDC';
// Funding Balance Withdraw
// 入参：
declare interface IRecord {
  coin: 'DAI' | 'USDT' | 'USDC';
  amount: number;
}

/**
 * Trade Order Status
 */
declare type IOrderStatus = 'ACTIVE' | 'CLOSED';

/**
 * Trade Order 记录
 */
declare interface ITradeRecord {
  id: string;
  time: number;
  type: 'long' | 'short';
  price: number;
  amount: number;
  cost: number;
  costCoin: string;
  fee: number;
  pl: {
    val: number;
    percentage: number;
  };
  status: IOrderStatus;
}

/**
 * Trade Liquidity Pool
 */
declare interface ITradePoolInfo {
  public: {
    value: number;
    total: number;
  };
  private: {
    value: number;
    total: number;
  };
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
