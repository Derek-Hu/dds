/**
 * 状态会根据PageState，WalletState的改变进行更新。
 */
import { constState } from './const-state';
import { walletState } from './wallet-state';
import { tradePriceGetter, userTradeAccountGetter, walletBalanceGetter } from './contract-state-getter';
import { TOKEN_SYMBOL } from '../constant/tokens';
import { of } from 'rxjs';

export const CONTRACT_STATE = {
  User: {
    WalletBalance: {
      SLD: {
        _depend: [constState.CONTRACTS.ERC20DDS, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      DAI: {
        _depend: [constState.CONTRACTS.ERC20DAI, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      USDT: {
        _depend: [constState.CONTRACTS.ERC20USDT, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      USDC: {
        _depend: [constState.CONTRACTS.ERC20USDC, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      ReDAI: {
        _depend: [constState.CONTRACTS.Lp1DAIContract, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      ReUSDT: {
        _depend: [constState.CONTRACTS.Lp1USDTContract, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
      ReUSDC: {
        _depend: [constState.CONTRACTS.Lp1USDCContract, walletState.USER_ADDR],
        _getter: walletBalanceGetter,
      },
    },
    Account: {
      DAI: {
        _depend: [constState.CONTRACTS.TradeDAIContract, walletState.USER_ADDR],
        _getter: userTradeAccountGetter,
      },
      USDT: {
        _depend: [constState.CONTRACTS.TradeUSDTContract, walletState.USER_ADDR],
        _getter: userTradeAccountGetter,
      },
      USDC: {
        _depend: [constState.CONTRACTS.TradeUSDCContract, walletState.USER_ADDR],
        _getter: userTradeAccountGetter,
      },
    },
  },
  Trade: {
    Price: {
      ETH: {
        DAI: {
          _depend: [constState.CONTRACTS.TradeDAIContract, of(TOKEN_SYMBOL.ETH)],
          _getter: tradePriceGetter,
        },
        USDT: {
          _depend: [constState.CONTRACTS.TradeUSDTContract, of(TOKEN_SYMBOL.ETH)],
          _getter: tradePriceGetter,
        },
        USDC: {
          _depend: [constState.CONTRACTS.TradeUSDCContract, of(TOKEN_SYMBOL.ETH)],
          _getter: tradePriceGetter,
        },
      },
      BTC: {
        DAI: {
          _depend: [constState.CONTRACTS.TradeDAIContract, of(TOKEN_SYMBOL.BTC)],
          _getter: tradePriceGetter,
        },
        USDT: {
          _depend: [constState.CONTRACTS.TradeUSDTContract, of(TOKEN_SYMBOL.BTC)],
          _getter: tradePriceGetter,
        },
        USDC: {
          _depend: [constState.CONTRACTS.TradeUSDCContract, of(TOKEN_SYMBOL.BTC)],
          _getter: tradePriceGetter,
        },
      },
    },
  },
};
