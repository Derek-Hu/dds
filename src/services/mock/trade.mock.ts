export const balance: IBalanceInfo = {
  balance: 92012,
  locked: 100,
  available: 91912,
};

export const curPrice = 1500.0;

export const poolInfo: ITradePoolInfo = {
  public: {
    value: 37863,
    total: 65349,
  },
  private: {
    value: 37863,
    total: 65349,
  },
};

export const orders: ITradeRecord[] = [
  {
    id: '001',
    time: new Date().getTime(),
    type: 'SHORT',
    price: 400.65,
    amount: 10.36,
    costCoin: 'DAI',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: 'CLOSED',
  },
  {
    id: '002',
    time: new Date().getTime(),
    type: 'SHORT',
    price: 400.65,
    amount: 10.36,
    costCoin: 'USDT',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: 'ACTIVE',
  },
  {
    id: '003',
    time: new Date().getTime(),
    type: 'LONG',
    price: 400.65,
    amount: 10.36,
    costCoin: 'USDC',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: 0.25,
    },
    status: 'CLOSED',
  },
];
