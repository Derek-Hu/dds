export const balance: IBalanceInfo = {
  balance: 92012,
  locked: 100,
  available: 91912,
};

export const curPrice: number = 1500.0;

export const poolInfo = {
  public: {
    value: 3532,
    total: 43248
  },
  private: {
    value: 353,
    total: 432482
  }
}
const infos = {
  'Ticker Root': 20,
  'Expiry Date': 'Funding Rate',
  'Settlements Fee Rate': 'Funding Rate',
  'Forced Liquidation Rate': 'Funding Rate',
  Type: 'Funding Rate',
  Exercise: 'Funding Rate',
  'Funding Rate': 'Funding Rate',
};
// @ts-ignore
export const infoItems: ITradeInfo[] = Object.keys(infos).map((key) => ({ label: key, value: infos[key] }));

export const orders: ITradeRecord[] = [
  {
    id: '001',
    time: new Date().getTime(),
    type: 'short',
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
    type: 'short',
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
    type: 'long',
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
