export const TOKEN_SYMBOL = {
  DAI: Symbol('DAI'),
  USDT: Symbol('USDT'),
  USDC: Symbol('USDC'),
  SLD: Symbol('SLD'),
  ETH: Symbol('ETH'),
  BTC: Symbol('BTC'),
  BNB: Symbol('BNB'),
  reDAI: Symbol('reDAI'),
  reUSDT: Symbol('reUSDT'),
  reUSDC: Symbol('reUSDC'),
};

export const ReTokens: IReUSDCoins[] = ['reDAI', 'reUSDT', 'reUSDC'];
export const ReTokenMapping: { [p in IReUSDCoins]: IUSDCoins } = {
  reDAI: 'DAI' as const,
  reUSDT: 'USDT' as const,
  reUSDC: 'USDC' as const,
};
