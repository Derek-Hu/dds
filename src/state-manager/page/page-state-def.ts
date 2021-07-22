import { TOKEN_SYMBOL } from '../../constant/tokens';
import { PageTradingPair, TradeDirection, TradeOrderTab } from '../state-types';

export const PAGE_STATE = {
  Trade: {
    Pair: {
      _default: { base: TOKEN_SYMBOL.ETH, quote: TOKEN_SYMBOL.DAI } as PageTradingPair,
    },
    Direction: {
      _default: 'LONG' as TradeDirection,
    },
    Create: {
      OpenAmount: {
        _default: 0,
      },
    },
    Orders: {
      ListTab: {
        _default: 'ACTIVE' as TradeOrderTab,
      },
      Active: {
        PageSize: {
          _default: 999,
        },
        PageIndex: {
          _default: 0,
        },
        HasMore: {
          _default: false,
        },
      },
      History: {
        PageSize: {
          _default: 10,
        },
        PageIndex: {
          _default: 0,
        },
        HasMore: {
          _default: true,
        },
      },
    },
  },
};
