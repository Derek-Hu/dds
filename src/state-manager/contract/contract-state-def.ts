/**
 * 状态会根据PageState，WalletState的改变进行更新。
 */
import { constState } from '../const/const-state';
import { walletState } from '../wallet/wallet-state';
import {
  maxOpenAmountGetter,
  orderListGetter,
  tradeFeeGetter,
  tradePairPriceGetter,
  tradePriceGetter,
  userTradeAccountGetter,
  walletBalanceGetter,
} from './contract-state-getter';
import { TOKEN_SYMBOL } from '../../constant/tokens';
import { NEVER, Observable, of } from 'rxjs';
import { ContractState, ContractStateTree, StateReference } from '../interface';
import _ from 'lodash';
import { switchMap } from 'rxjs/operators';
import { P } from '../page/page-state-parser';

class StateHolder implements StateReference {
  private treeRoot: ContractStateTree<any> | null = null;

  constructor(private path: string) {}

  getRef(): Observable<any> {
    return of(true).pipe(
      switchMap(() => {
        if (this.treeRoot && _.has(this.treeRoot, this.path)) {
          return (_.get(this.treeRoot, this.path) as ContractState<any>).watch() as Observable<any>;
        }

        console.warn('state reference can not get a instance.', this.treeRoot, this.path);
        return NEVER;
      })
    );
  }

  setRoot(root: ContractStateTree<any>) {
    this.treeRoot = root;
    return this;
  }
}

function Ref(path: string): StateReference {
  return new StateHolder(path);
}

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
    DepositWalletBalance: {
      _depend: [constState.DepositERC20Contract, walletState.USER_ADDR],
      _getter: walletBalanceGetter,
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
    CurTradePairAccount: {
      _depend: [constState.TradeOptionContract, walletState.USER_ADDR],
      _getter: userTradeAccountGetter,
    },
  },
  Trade: {
    Price: {
      ETHDAI: {
        _depend: [constState.CONTRACTS.TradeDAIContract, of(TOKEN_SYMBOL.ETH), of(TOKEN_SYMBOL.DAI)],
        _getter: tradePriceGetter,
      },
      ETHUSDT: {
        _depend: [constState.CONTRACTS.TradeUSDTContract, of(TOKEN_SYMBOL.ETH), of(TOKEN_SYMBOL.USDT)],
        _getter: tradePriceGetter,
      },
      ETHUSDC: {
        _depend: [constState.CONTRACTS.TradeUSDCContract, of(TOKEN_SYMBOL.ETH), of(TOKEN_SYMBOL.USDC)],
        _getter: tradePriceGetter,
      },
      BTCDAI: {
        _depend: [constState.CONTRACTS.TradeDAIContract, of(TOKEN_SYMBOL.BTC), of(TOKEN_SYMBOL.DAI)],
        _getter: tradePriceGetter,
      },
      BTCUSDT: {
        _depend: [constState.CONTRACTS.TradeUSDTContract, of(TOKEN_SYMBOL.BTC), of(TOKEN_SYMBOL.USDT)],
        _getter: tradePriceGetter,
      },
      BTCUSDC: {
        _depend: [constState.CONTRACTS.TradeUSDCContract, of(TOKEN_SYMBOL.BTC), of(TOKEN_SYMBOL.USDC)],
        _getter: tradePriceGetter,
      },
    },
    CurPairPrice: {
      _depend: [constState.TradeOptionContract, P.Trade.Pair],
      _getter: tradePairPriceGetter,
    },
    Create: {
      CurMaxOpenAmount: {
        _depend: [constState.TradeOptionContract, P.Trade.Direction, P.Trade.Pair, Ref('User.CurTradePairAccount')],
        _getter: maxOpenAmountGetter,
      },
      CurOpenOrderFee: {
        _depend: [constState.TradeOptionContract, P.Trade.Create.OpenAmount, P.Trade.Pair, P.Trade.Direction],
        _getter: tradeFeeGetter,
      },
    },
    OrderList: {
      Active: {
        _depend: [walletState.USER_ADDR, walletState.NETWORK, P.Trade.Orders.Active.PageIndex],
        _getter: orderListGetter.bind(null, 'ACTIVE'),
      },
      HISTORY: {
        _depend: [walletState.USER_ADDR, walletState.NETWORK],
        _getter: orderListGetter.bind(null, 'HISTORY'),
      },
    },
  },
};
