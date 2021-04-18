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
