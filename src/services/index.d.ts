declare type ITradeType = 'long' | 'short';

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

declare type IFromCoins = 'ETH' | 'BTC';
declare type IDDS = 'DDS';
declare type IUSDCoins = 'DAI' | 'USDT' | 'USDC';
declare type IReUSDCoins = 'reDAI' | 'reUSDT' | 'reUSDC';
declare type IExchangePair = 'ETHDAI' | 'EHTUSDT' | 'ETHUSDC' | 'BTCDAI' | 'BTCUSDT' | 'BTCUSDC';

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
  id: string;
  time: number;
  type: ITradeType;
  price: number;
  // openPrice: number;
  // curPrice: number;
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

// Pool 页面
declare interface IPoolCoinAmount {
  coin: IUSDCoins;
  amount: number;
}

/*pool type*/
declare type IPoolType = 'public' | 'private';

declare interface PoolPercentInfo {
  DAI: CoinAvailableInfo;
  USDT: CoinAvailableInfo;
  USDC: CoinAvailableInfo;
}

declare interface CoinValueInfo {
  DAI: number;
  USDT: number;
  USDC: number;
}

declare interface SwapValueInfo extends CoinValueInfo {
  USD: number; // DAI+USDT+USDC总数
  DDS: number; // DDS总数
  DDSPartAmount: number; // 1/10数量的DDS，用于页面显示
  DDSPrice: number; // 一个DDS能兑换多少个USD
}

declare interface PoolContractDetail {
  id: string;
  time: number;
  amount: number;
  locked: number;
  coin: IUSDCoins;
  fee: number;
  status: IOrderStatus;
}

declare interface MiningTokenBalance {
  reDAI: number;
  reUSDT: number;
  reUSDC: number;
}

declare type LiquiditorRanking = [string, string, string];

declare type RewardRecord = {
  id: string;
  amount: number;
  time: number;
  price: number;
  reward: number;
};

declare interface SwapParam {
  ddsAmount: number;
  coin: IUSDCoins;
}

declare interface MyReferralSummary {
  bonus: number;
  level: string;
  ranking: number;
  referrals: number;
}

declare type TimeStamp = number;

declare interface CampaignRewardPool {
  nextDistribution: TimeStamp;
  coins: CoinValueInfo;
}

interface ICoinItem {
  coin: IUSDCoins;
  amount: number;
  total?: number;
}

declare interface ICoinValue {
  coin: string;
  value: number;
}

declare interface IPoolShareInPool extends ICoinItem {}

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
  ranking: number;
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
    percentage?: any;
    val?: any;
  };
}

declare interface UserAccountInfo {
  address: string;
  USDBalance: { coin: IUSDCoins; amount: number }[];
}

// 私池订单信息
declare interface PrivatePoolOrder {
  orderId: string;
  time: number;
  amount: number;
  lockedAmount: number;
  status: IOrderStatus;
  openPrice: number;
  coin: IUSDCoins;
}
