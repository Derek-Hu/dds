const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getLiquidityMiningReward = (
  type: 'public' | 'private'
): Promise<{
  amount: number;
  refactor: number;
}> => {
  return returnVal({
    amount: 23849320,
    refactor: 32893220,
  });
};

export const getLiquidityLockedReward = (type: 'public' | 'private'): Promise<number> => {
  return returnVal(Math.random() * 100000);
};

export const getLiquiditorBalanceRecord = (): Promise<ILiquiditorBalanceRecord[]> => {
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

export const getLiquiditorReward = (type: 'public' | 'private'): Promise<{ campaign: number; compensate: number }> => {
  return returnVal({
    campaign: Math.random() * 100000,
    compensate: Math.random() * 100000,
  });
};

export const getLiquidityReTokenBalance = (): Promise<ICoinValue[]> => {
  return returnVal([
    {
      coin: 'reDAI',
      value: 100,
    },
    {
      coin: 'reUSDT',
      value: 2200,
    },
    {
      coin: 'reUSDC',
      value: 300,
    },
  ]);
};

export const getLiquiditorSystemBalance = (): Promise<ICoinValue[]> => {
  return returnVal([
    {
      coin: 'DAI',
      value: 100,
    },
    {
      coin: 'USDT',
      value: 2200,
    },
    {
      coin: 'USDC',
      value: 300,
    },
  ]);
};

export const getLiquidityMiningShare = (): Promise<ICoinItem[]> => {
  return returnVal([
    {
      coin: 'USDC',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
    {
      coin: 'USDT',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
    {
      coin: 'DAI',
      amount: Math.random() * 1000,
      total: Math.random() * 10000,
    },
  ]);
};
