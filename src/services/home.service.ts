const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};
export const getNonRisks = (): Promise<INonRecords> => {
  return returnVal({
    total: 32489320,
    data: [
      {
        fromCoin: 'WBTC',
        toCoin: 'DAI',
        price: 7173.77,
        change: 8.23,
      },
      {
        fromCoin: 'ETH',
        toCoin: 'DAI',
        price: 183.28,
        change: -10.01,
      },
    ],
  });
};
