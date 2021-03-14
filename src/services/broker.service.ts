const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const account2ReferalCode = (address: string) => {
  return address;
};
export const getSparkData = async (): Promise<IBrokerSpark> => {
  return returnVal({
    commission: 40,
    bonus: 98247489,
    referals: 9824,
  });
};

export const getMyReferalInfo = async (): Promise<IBrokerReferal> => {
  return returnVal({
    bonus: 329,
    level: 'A',
    ranking: 39,
    referals: 389203,
  });
};

export const claimReferalInfo = async (): Promise<boolean> => {


  return returnVal({
    bonus: 329,
    level: 'A',
    ranking: 39,
    referals: 389203,
  });
};

export const getBrokerCampaignRewardData = async (): Promise<ICoinValue[]> => {
  return returnVal([
    {
      coin: 'DAI',
      value: Math.random() * 10000000,
    },
    {
      coin: 'USDC',
      value: Math.random() * 10000000,
    },
    {
      coin: 'USDT',
      value: Math.random() * 10000000,
    },
  ]);
};

export const getBrokerCampaignPool = async (): Promise<{ nextDistribution: string; data: ICoinItem[] }> => {
  return returnVal({
    data: [
      {
        coin: 'USDT',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
      {
        coin: 'USDC',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
      {
        coin: 'DAI',
        amount: Math.random() * 10000000,
        total: Math.random() * 10000000,
      },
    ],
    nextDistribution: '2020-02-10',
  });
};

export const getBrokerCampaignRewardsPool = async (): Promise<IBrokerCampaignRecord[]> => {
  return returnVal([
    {
      time: new Date().getTime(),
      pair: {
        from: 'ETH',
        to: 'DAI',
      },
      price: 32432,
      amount: 32,
      reward: 32,
    },
  ]);
};

export const getBrokerCommissionData = async (): Promise<ICoinValue[]> => {
  return returnVal([
    {
      coin: 'DAI',
      value: Math.random() * 10000000,
    },
    {
      coin: 'USDC',
      value: Math.random() * 10000000,
    },
    {
      coin: 'USDT',
      value: Math.random() * 10000000,
    },
  ]);
};

export const getBrokerCommissionRecords = async (): Promise<IBrokerCommissionRecord[]> => {
  return returnVal([
    {
      time: new Date().getTime(),
      pair: {
        from: 'ETH',
        to: 'DAI',
      },
      price: 32432,
      amount: 32,
      reward: 32,
    },
  ]);
};
