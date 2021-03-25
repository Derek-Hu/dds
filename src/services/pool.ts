import { userPoolBalance, userPoolInfo } from '../services/mock/pool.mock';

/**
 * 获取ARP值
 */
export const getPubPoolArp = async (): Promise<number> => {
  return Promise.resolve(5300);
};

/**
 * 从法币coin获取reCoin数量，用于向公共池deposit时计算，deposit相对withdraw从DAI计算reDAI的换算关系不同
 * 目前不需要从reDai到Dai的换算
 *
 * @param coinAmount
 * @return reCoinAmount
 */
export const getDepositReCoinAmountFromCoin = async (coinAmount: ICoinAmount): Promise<number> => {
  return Promise.resolve(coinAmount.amount);
};

/**
 * 从法币coin获取reCoin数量，用于从公共池withdraw时计算，deposit相对withdraw从DAI计算reDAI的换算关系不同
 * 目前不需要从reDai到Dai的换算
 *
 * @param coinAmount
 * @return reCoinAmount
 */
export const getWithdrawReCoinAmountFromCoin = async (coinAmount: ICoinAmount): Promise<number> => {
  return Promise.resolve(coinAmount.amount);
};

/**
 * 向资金池提供流动性
 *
 * @param coinAmount - 法币数量
 * @param poolType - 池子类型
 */
export const provideCoinToPool = async (coinAmount: ICoinAmount, poolType: IPoolType): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * 返回池子中每种法币可用（/自己）与不可用（/全部）的值。
 * @param poolType - 资金池类型
 * @param isPublic - 是否登陆，ture: 未登录，false：已登陆
 */
export const getPoolAvailableInfo = async (poolType: IPoolType, isPublic: boolean): Promise<PoolPercentInfo> => {
  return Promise.resolve(userPoolInfo);
};

/**
 * 返回资金池中的总体/个人余额
 * @param poolType - 资金池类型
 * @param isPublic - 是否登陆，ture: 未登录，false：已登陆
 */
export const getPoolBalanceInfo = async (poolType: IPoolType, isPublic: boolean): Promise<CoinValueInfo> => {
  return Promise.resolve(userPoolBalance);
};

/**
 * 从资金池中取出代币
 * @param poolType - 资金池类型
 * @param coinAmount - 需要取出的法币coin数量
 */
export const withdrawFromPool = async (poolType: IPoolType, coinAmount: ICoinAmount): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * 向个人私池交易订单中补仓
 *
 * @param detail - 锁仓订单
 * @param coinAmount - 补仓数量
 */
export const appendCoinToPrivatePool = async (
  detail: PoolContractDetail,
  coinAmount: ICoinAmount
): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * 获取私有池中个人的锁仓订单
 *
 * @param page - from 1
 * @param pageSize - 每页数量
 */
export const getLiquidityLockedDetails = async (page: number, pageSize = 10): Promise<PoolContractDetail[]> => {
  return Promise.resolve([]);
};
