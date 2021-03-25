/**
 * 返回Broker的邀请码，使用地址换算
 */
import { campaignPool, campaignReward, summary } from './mock/broker.mock';

export const getBrokerCode = async (): Promise<string> => {
  return Promise.resolve('78998d798');
};

/**
 * 邀请用户获取到的奖励值
 *
 * SPARK PROGRAM Bonus(USD)
 */
export const getBonus = async (): Promise<number> => {
  // 获取三种稳定币的数量，相加活动
  return Promise.resolve(98247489);
};

/**
 * get MY REFERRAL Summary
 */
export const getMyReferralSummary = async (): Promise<MyReferralSummary> => {
  // 一个接口查询调回，排名只在前50有真实排名， 后面都一律写51，前端需要做优化显示
  return Promise.resolve(summary);
};

/**
 * My Referral Claim
 * 将所有的奖励提取出来
 */
export const claimBonus = async (): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * get My Referral Commission
 */
export const getCommission = async (): Promise<CoinValueInfo> => {
  return Promise.resolve({ DAI: 647, USDT: 7378, USDC: 638 });
};

/**
 * get My Referral Commission History
 */
export const getCommissionRecords = async (): Promise<[]> => {
  return Promise.resolve([]);
};

/**
 * get My Referral Campaign Rewards Pool
 */
export const getRewardPool = async (): Promise<CampaignRewardPool> => {
  // 获取总池子分别的数量，个人的数量通过常数比例计算得出
  return Promise.resolve(campaignPool);
};

/**
 * get My Referral Campaign Reward
 */
export const getCampaignReward = async (): Promise<CoinValueInfo> => {
  return Promise.resolve(campaignReward);
};

/**
 * 列表记录类暂时不做
 *
 * @param page
 * @param pageSize
 */
export const getCampaignRewardRecords = async (page: number, pageSize = 10): Promise<[]> => {
  return Promise.resolve([]);
};
