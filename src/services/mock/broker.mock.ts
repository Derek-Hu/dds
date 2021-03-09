export const summary: MyReferralSummary = {
  level: 'A',
  ranking: 9824,
  referrals: 9824,
  bonus: 98247489,
};

export const campaignReward: CoinValueInfo = {
  DAI: 0,
  USDC: 1,
  USDT: 2,
};

export const campaignPool: CampaignRewardPool = {
  nextDistribution: new Date().getTime() + 999999,
  coins: {
    DAI: 0,
    USDC: 0,
    USDT: 0,
  },
};
