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

export type Token = keyof typeof TOKEN_SYMBOL;
export const TOKEN_SYMBOL_MAP = (Object.keys(TOKEN_SYMBOL) as Token[]).reduce((map, key) => {
  map.set(key, TOKEN_SYMBOL[key]);
  return map;
}, new Map<Token, symbol>());

export const TRADE_PAIR_SYMBOL = {
  ETHDAI: Symbol('ETHDAI'),
  ETHUSDT: Symbol('ETHUSDT'),
  ETHUSDC: Symbol('ETHUSDC'),
  BTCDAI: Symbol('BTCDAI'),
  BTCUSDT: Symbol('BTCUSDT'),
  BTCUSDC: Symbol('BTCUSDC'),
};

export type TradePair = keyof typeof TRADE_PAIR_SYMBOL;
export const TRADE_PAIR_SYMBOL_MAP = (Object.keys(TRADE_PAIR_SYMBOL) as TradePair[]).reduce((map, key) => {
  map.set(key, TRADE_PAIR_SYMBOL[key]);
  return map;
}, new Map());

export function getTradePairSymbol(base: symbol, quote: symbol): symbol | null {
  const pairDesc: string = base.description || '' + quote.description || '';
  const pairSymbol: symbol | undefined = TRADE_PAIR_SYMBOL_MAP.get(pairDesc);

  return pairSymbol || null;
}

export function getPairTokenSymbols(pair: symbol): { base: symbol; quote: symbol } | null {
  const desc: string = pair.description as string;
  const bases: (keyof typeof TOKEN_SYMBOL)[] = Array.from(TOKEN_SYMBOL_MAP.keys()).filter(one => desc.startsWith(one));
  if (bases.length > 0) {
    const base: symbol | undefined = TOKEN_SYMBOL_MAP.get(bases[0]);
    const quoteDesc: keyof typeof TOKEN_SYMBOL = desc.substring(bases[0].length) as keyof typeof TOKEN_SYMBOL;
    const quote: symbol | undefined = TOKEN_SYMBOL_MAP.get(quoteDesc);

    return base && quote ? { base, quote } : null;
  }
  return null;
}

export const ReTokens: IReUSDCoins[] = ['reDAI', 'reUSDT', 'reUSDC'];
export const ReTokenMapping: { [p in IReUSDCoins]: IUSDCoins } = {
  reDAI: 'DAI' as const,
  reUSDT: 'USDT' as const,
  reUSDC: 'USDC' as const,
};
