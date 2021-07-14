import { PageTradingPair } from './page-state-types';
import { TOKEN_SYMBOL } from '../constant/tokens';

export const PAGE_STATE = {
  Trade: {
    Pair: {
      _default: { base: TOKEN_SYMBOL.ETH, quote: TOKEN_SYMBOL.DAI } as PageTradingPair,
      _serializer: (state: PageTradingPair) => (state.base.description || '') + (state.quote.description || ''),
    },
  },
};
