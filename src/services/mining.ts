/**
 * 获取 Mining Reward
 * @param isPublic - 是否已经登陆：true: 未登录，false: 已登陆
 */
export const getMiningAndLockedReward = async (isPublic: boolean): Promise<{ mining: number; locked: number }> => {
  return Promise.resolve({ mining: 530400, locked: 530400 });
};

/**
 * 获取清算者 Mining Rewards
 * @param isPublic - 是否已经登陆：true: 未登录，false: 已登陆
 *
 * 未登录，没有数据？ // TODO
 * 登陆后，两个数一起获取，为什么是dds，首先给清算者的收益是稳定比，为什么默认是DDA //TODO
 */
export const getLiquiditorMiningReward = async (
  isPublic: boolean
): Promise<{ campaign: number; compensate: number }> => {
  return Promise.resolve({ campaign: 530400, compensate: 530400 });
};

/**
 * 获取 LIQUIDITY Mining balance
 * 页面删除，没有存在意义
 * @deprecated
 */
export const getMiningReCoinBalance = async (): Promise<MiningTokenBalance> => {
  return Promise.resolve({ reDAI: 647, reUSDT: 7378, reUSDC: 638 });
};

/**
 * 页面将三种百分比，改为只展示成一个百分比
 */
export const getMiningShare = async (): Promise<CoinAvailableInfo> => {
  return Promise.resolve({ value: 435, total: 37863 });
};

/**
 * 认领(claim)所有lock reward
 */
export const claimLiquidityLockedRewards = async (): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * 获取Liquiditor排名前三名地址
 */
export const getLiquiditorRankings = async (): Promise<LiquiditorRanking> => {
  return Promise.resolve([
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
  ]);
};

/**
 * 获取风险准备金账户余额 system balance
 *
 * 风险准备池，需要去法币合约分别查询某个固定地址的余额
 */
export const getSystemFundBalance = async (): Promise<CoinValueInfo> => {
  return Promise.resolve({ DAI: 647, USDC: 638, USDT: 7378 });
};

/**
 * 收益余额历史，当前先不做
 */
export const getRewardBalanceRecords = async (): Promise<RewardRecord[]> => {
  return Promise.resolve([]);
};

//
