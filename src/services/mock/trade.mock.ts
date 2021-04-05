export const balance: IBalanceInfo = {
  balance: 92012,
  locked: 100,
  available: 91912,
};

export const curPrice = 1500.0;

const infos = {
  'Ticker Root': 20,
  'Expiry Date': 'Funding Rate',
  'Settlement Fee Rate': 'Funding Rate',
  'Forced Liquidation Rate': 'Funding Rate',
  Type: 'Funding Rate',
  Exercise: 'Funding Rate',
  'Funding Rate': 'Funding Rate',
};
// @ts-ignore
export const infoItems: ITradeInfo[] = Object.keys(infos).map(key => ({ label: key, value: infos[key] }));

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
    hash: '0xabebbe4b2982a0aa601daed0eda47e32e7b476b923dd6dbf1746654bec3522513',
    id: '001',
    time: new Date().getTime(),
    type: 'SHORT',
    price: 400.65,
    closePrice: undefined,
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
    hash: '0xabebbe4b2982a0aa601daed0eda47e32e7b476b923dd6dbf1746654bec3522513',
    id: '002',
    time: new Date().getTime(),
    type: 'SHORT',
    price: 400.65,
    closePrice: undefined,
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
    hash: '0xabebbe4b2982a0aa601daed0eda47e32e7b476b923dd6dbf1746654bec3522513',
    id: '003',
    time: new Date().getTime(),
    type: 'LONG',
    price: 400.65,
    closePrice: undefined,
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
