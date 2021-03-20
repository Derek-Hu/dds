export const defaultPoolData: ICoinItem[] = [
  {
    coin: 'DAI',
    amount: 0,
    total: 0,
  },
  {
    coin: 'USDT',
    amount: 0,
    total: 0,
  },
  {
    coin: 'USDC',
    amount: 0,
    total: 0,
  },
];

export const defaultCoinDatas: { [key in IUSDCoins]: number} = {
  DAI: 0,
  USDT: 0,
  USDC: 0,
}

export const defaultReTokenData: ICoinValue[] = [
  {
    coin: 'reDAI',
    value: 0,
  },
  {
    coin: 'reUSDT',
    value: 0,
  },
  {
    coin: 'reUSDC',
    value: 0,
  },
];
