import { Observable } from 'rxjs';
import { BigNumber, Contract } from 'ethers';

export interface ContractRead {
  getUserSelfWalletBalance(address: string): Observable<CoinBalance[]>;

  getUserSelfReTokenBalance(address: string): Observable<CoinBalance[]>;

  /**
   * 用户提供公池流动性获取的reToken信息
   *
   * @param address
   */
  getUserReTokenShareInfo(address: string): Observable<CoinShare[]>;

  priPoolUserBalance(address: string): Observable<PrivatePoolAccountInfo>;

  /**
   * 获取用户公池流动性质押的奖励（质押reToken）
   *
   * @param address
   */
  getReTokenLiquidityReward(address: string): Observable<PubPoolRewards>;

  /**
   * 用户公池流动性挖矿的质押信息
   */
  getPubPoolLiquidityShareInfo(address: string): Observable<PubPoolLockInfo>;
}

export interface ApprovalAction {
  approveReToken(reToken: IReUSDCoins): Observable<boolean>;

  needApproveReToken(amount: number, address: string, reToken: IReUSDCoins): Observable<boolean>;

  approveUSDFunding(usdToken: IUSDCoins): Observable<boolean>;

  needApproveUSDFunding(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  needApprovePubPool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  approvePubPool(usdToken: IUSDCoins): Observable<boolean>;

  needApprovePrivatePool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  approvePrivatePool(usdToken: IUSDCoins): Observable<boolean>;
}

export interface ActivityItems {
  claimTestToken(token: IUSDCoins): Observable<boolean>;

  isTestTokenClaimed(userAddr: string, token: IUSDCoins): Observable<boolean>;

  airDropWhiteList(address: string): Observable<BigNumber>;

  airDropClaim(): Observable<boolean>;

  airDropHasClaimed(address: string): Observable<boolean>;
}

/**
 * 合约接口
 */
export interface ContractProxy extends ContractRead, ApprovalAction, ActivityItems {
  //
  createAContract(abi: any[], address: string): Observable<Contract>;

  getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangeStr, maxUSDAmount: number): Observable<BigNumber>;

  getMaxOpenTradeAmount(
    exchange: ExchangeCoinPair,
    type: ITradeType,
    availableUsdAmount: number
  ): Observable<BigNumber>;

  depositToken(address: string, count: number, coin: IUSDCoins): Observable<boolean>;

  withdrawToken(count: number, coin: IUSDCoins): Observable<boolean>;

  confirmContract(exchangeStr: IExchangeStr, count: number, type: ITradeType): Observable<ConfirmInfo>;

  /**
   *
   * @param coin
   * @param orderType
   * @param amount
   * @param userPrice - 用户认可的价格
   * @param inviter
   * @param slider - 滑点价格百分比 8 === 8%
   * @param timeout - 超时时常 1分钟 === 60
   */
  createContract(
    coin: IUSDCoins,
    orderType: ITradeType,
    amount: number,
    userPrice: number,
    inviter: string,
    slider: number,
    timeout: number
  ): Observable<string>;

  closeContract(orderId: ITradeRecord): Observable<boolean>;

  getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangeStr, ethAmount: number): Observable<BigNumber>;

  getUserOrders(address: string, curPrice: BigNumber, page: number, pageSize: number): Observable<any>;

  getPubPoolInfo(coin: IUSDCoins): Observable<any>;

  getPrivatePoolInfo(coin: IUSDCoins): Observable<any>;

  //

  getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber>;

  getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber>;

  provideToPubPool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean>;

  pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>>;

  pubPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>>;

  getReTokenBalance(address: string): Observable<CoinBalance[]>;

  getPubPoolWithdrawDate(address: string): Observable<{ coin: IUSDCoins; time: number }[]>;

  //

  getLockedLiquidityList(
    address: string,
    page: number,
    pageSize: number,
    devTest: boolean
  ): Observable<PrivateLockLiquidity[]>;

  addMarginAmount(orderId: string, coin: IUSDCoins, amount: number): Observable<boolean>;

  provideToPrivatePool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>>;

  // priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>>;

  /**
   * @param isReject - 是否停止接单。true：停止接单；false：继续接单
   */
  setPriPoolRejectOrder(isReject: boolean): Observable<boolean>;

  //

  getLiquidityMiningReward(address: string): Observable<BigNumber>;

  getLiquidityMiningShare(address: string): Observable<CoinShare[]>;

  /**
   * @Deprecated
   */
  getActiveLiquidityRewards(address: string): Observable<BigNumber>;

  /**
   * 质押reToken，储备流动性挖矿
   * @param reToken
   * @param reTokenAmount
   */
  lockReTokenForLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean>;

  unLockReTokenFromLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean>;

  claimRewardsForLP1(): Observable<boolean>;

  //queryLockedReTokenAmount(): Observable<any>;

  claimRewardsForLP2(): Observable<boolean>;

  getSystemFundingBalance(): Observable<CoinBalance[]>;

  getLiquiditorRewards(address: string): Observable<LiquditorRewardsResult>;

  getLiquiditorPeriod(): Observable<{ startTime: BigNumber; period: BigNumber }>;

  getLiquiditorRewardsOfPeriod(
    address: string,
    period: number
  ): Observable<{
    rewards: CoinBalance[];
    info: { extSLD: BigNumber; rank: BigNumber };
  }>;

  getLiquiditorRatingList(period: number): Observable<string[]>;

  //

  getSwapBurnInfo(): Observable<CoinBalance[]>;

  doSwap(address: string, coin: IUSDCoins, ddsAmount: number): Observable<boolean>;

  getBrokerInfo(address: string): Observable<{ refer: BigNumber; claim: CoinBalance[] }>;

  getBrokerAllCommission(address: string): Observable<CoinBalance[]>;

  getBrokerMonthlyAwardsInfo(address: string): Observable<CoinBalance[]>;

  getBrokerMonthlyStartTime(): Observable<number>;

  getBrokerMonthlyRewardPool(): Observable<CoinBalance[]>;

  doBrokerClaim(): Observable<boolean>;
}

export interface UserAccountInfo {
  deposit: BigNumber;
  available: BigNumber;
}

export interface ContractParam {
  exchangeType: 'ETHDAI';
  number: BigNumber;
  contractType: 1 | 2;
}

export interface CoinShare {
  coin: IUSDCoins;
  value: BigNumber;
  total: BigNumber;
}

export interface CoinBalance {
  coin: IUSDCoins | IReUSDCoins | ISLD;
  balance: BigNumber;
}

export interface PrivateLockLiquidity {
  orderId: number;
  usdToken: IUSDCoins;
  makerAddr: string;
  marginAmount: BigNumber;
  marginFee: BigNumber;
  takerId: BigNumber;
  status: IOrderStatus;
  locked: boolean;
}

export interface ConfirmInfo {
  currentPrice: BigNumber;
  exchgFee: BigNumber;
  openFee: BigNumber;
  total: BigNumber;
}

export interface ContractInfo {
  abi: any[];
  address: string;
}

export type LiquditorRewardsResult = {
  usdRewards: CoinBalance[];
  campaign: BigNumber;
  compensate: BigNumber;
  rank: BigNumber;
};

export interface PrivatePoolAccountInfo {
  total: CoinBalance[];
  available: CoinBalance[];
  locked: CoinBalance[];
  isRejectOrder: { coin: IUSDCoins; reject: boolean }[];
}

export interface PubPoolRewards {
  available: BigNumber;
  vesting: BigNumber;
  unactivated: BigNumber;
}

export interface ReTokenAmountNum {
  reDAI: BigNumber;
  reUSDT: BigNumber;
  reUSDC: BigNumber;
}

export interface LpTokenAmountNum {
  lpDAI: BigNumber;
  lpUSDT: BigNumber;
  lpUSDC: BigNumber;
}

export interface PubPoolLockInfo {
  lockedReToken: ReTokenAmountNum;
  totalLockedReToken: ReTokenAmountNum;
  lpToken: LpTokenAmountNum;
  totalLpToken: LpTokenAmountNum;
}
