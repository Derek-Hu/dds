declare type ITradeType = 'LONG' | 'SHORT';

/**
 * Funding Balance 下单入参
 */
declare interface ITradeOpenParam {
  amount: number;
  type: ITradeType;
  referal: string;
  coin: IUSDCoins;
}

/**
 * Funding Balance 账户信息
 */
declare interface IBalanceInfo {
  balance: number;
  locked: number;
  available?: number;
}

// Funding Balance Deposit
// 入参：
declare interface ICoinAmount {
  coin: IUSDCoins;
  amount: number;
}

declare type IFromCoins = 'ETH' | 'BTC' | 'BNB';
declare type ISLD = 'SLD';
declare type IUSDCoins = 'DAI' | 'USDT' | 'USDC';
declare type IReUSDCoins = 'reDAI' | 'reUSDT' | 'reUSDC';
declare type IExchangeStr = 'ETHDAI' | 'EHTUSDT' | 'ETHUSDC' | 'BTCDAI' | 'BTCUSDT' | 'BTCUSDC' | 'BNBDAI';

declare interface ExchangeCoinPair {
  USD: IUSDCoins;
  ETH: IFromCoins;
}

declare interface CoinNumber {
  value: BigNumber;
  precision: number;
}

// Funding Balance Withdraw
// 入参：
declare interface IRecord {
  coin: IUSDCoins;
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
  network: string;
  hash: string;
  userAddress: string;
  id: string;
  time: number;
  type: ITradeType;
  price: number;
  closePrice: number | undefined;
  amount: number;
  cost: number;
  costCoin: IUSDCoins;
  fee: number;
  pl: {
    val: number;
    percentage: number;
  };
  status: IOrderStatus;
}

declare interface IOpenFee {
  curPrice: number;
  settlementFee: number;
  fundingFeeLocked: number;
}

declare interface CoinAvailableInfo {
  value: number;
  total: number;
}

/**
 * Trade Liquidity Pool
 */
declare interface ITradePoolInfo {
  public: CoinAvailableInfo;
  private: CoinAvailableInfo;
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

declare interface CoinValueInfo {
  DAI: number;
  USDT: number;
  USDC: number;
}

declare interface MiningTokenBalance {
  reDAI: number;
  reUSDT: number;
  reUSDC: number;
}

declare type LiquiditorRanking = [string, string, string];

interface ICoinItem {
  coin: IUSDCoins;
  amount: number;
  total?: number;
}

declare interface ICoinValue {
  coin: string;
  value: number;
}

type IPoolShareInPool = ICoinItem;

declare interface ISwapBurn {
  usd: number;
  dds: number;
  rate: number;
}

declare interface IBrokerSpark {
  commission: number;
  bonus: number;
  referals: number;
}

// BROKER - MY REFERRAL
declare interface IBrokerReferal {
  bonus: number;
  level: string;
  ranking: string;
  referals: number;
}

declare interface IBrokerCommissionRecord {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
  reward: number;
}

declare interface IBrokerCampaignRecord {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
  reward: number;
}

declare interface ILiquiditorBalanceRecord {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
  reward: number;
}

// 清算者在单个清算周期内的收益
declare interface ILiquiditorPeriodReward {
  rewards: ICoinValue[]; // DAI,USDT,USDC,SLD 收益余额
  extSLD: number; // 前三名会获得额外SLD，包含在上面的SLD余额中
  rank: number; // 排名，不在排名榜中返回0
}

declare interface INonRiskPerpetual {
  fromCoin: IFromCoins;
  toCoin: IUSDCoins;
  price: number;
  change: number;
  chart?: string;
}

declare interface INonRecords {
  total: number;
  data: INonRiskPerpetual[];
}

declare interface ICoinProgressObj {
  [label: string]: {
    percentage?: number;
    val?: any;
  };
}

declare interface UserAccountInfo {
  address: string;
  network: string;
  USDBalance: { coin: IUSDCoins; amount: number }[];
}

declare type IAccount = (Omit<UserAccountInfo, 'USDBalance'> & { USDBalance: { [coin: string]: number } }) | null;

// 私池订单信息
declare interface PrivatePoolOrder {
  network: string;
  hash: string;
  userAddress: string;
  orderId: string;
  time: number;
  type: ITradeType;
  amount: number;
  lockedAmount: number;
  status: IOrderStatus;
  openPrice: number;
  coin: IUSDCoins;
}

declare interface IRankings {
  top: Array<string>;
  current: number;
}
