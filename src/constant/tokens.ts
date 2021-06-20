export const ReTokens: IReUSDCoins[] = ['reDAI', 'reUSDT', 'reUSDC'];
export const ReTokenMapping: { [p in IReUSDCoins]: IUSDCoins } = {
  reDAI: 'DAI' as const,
  reUSDT: 'USDT' as const,
  reUSDC: 'USDC' as const,
};
