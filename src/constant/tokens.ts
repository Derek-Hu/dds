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

export const TRADE_PAIR_SYMBOL = {
  ETHDAI: Symbol('ETHDAI'),
  ETHUSDT: Symbol('ETHUSDT'),
  ETHUSDC: Symbol('ETHUSDC'),
  BTCDAI: Symbol('BTCDAI'),
  BTCUSDT: Symbol('BTCUSDT'),
  BTCUSDC: Symbol('BTCUSDC'),
};

export function getTradePairSymbol(base: symbol, quote: symbol): symbol | null {
  switch (base) {
    case TOKEN_SYMBOL.ETH: {
      switch (quote) {
        case TOKEN_SYMBOL.DAI: {
          return TRADE_PAIR_SYMBOL.ETHDAI;
        }
        case TOKEN_SYMBOL.USDT: {
          return TRADE_PAIR_SYMBOL.ETHUSDT;
        }
        case TOKEN_SYMBOL.USDC: {
          return TRADE_PAIR_SYMBOL.ETHUSDC;
        }
        default: {
          return null;
        }
      }
    }
    case TOKEN_SYMBOL.BTC: {
      switch (quote) {
        case TOKEN_SYMBOL.DAI: {
          return TRADE_PAIR_SYMBOL.BTCDAI;
        }
        case TOKEN_SYMBOL.USDT: {
          return TRADE_PAIR_SYMBOL.BTCUSDT;
        }
        case TOKEN_SYMBOL.USDC: {
          return TRADE_PAIR_SYMBOL.BTCUSDC;
        }
        default: {
          return null;
        }
      }
    }
    default: {
      return null;
    }
  }
}

export const ReTokens: IReUSDCoins[] = ['reDAI', 'reUSDT', 'reUSDC'];
export const ReTokenMapping: { [p in IReUSDCoins]: IUSDCoins } = {
  reDAI: 'DAI' as const,
  reUSDT: 'USDT' as const,
  reUSDC: 'USDC' as const,
};
