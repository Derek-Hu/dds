import { walletState } from '../wallet/wallet-state';
import { P } from '../page/page-state-parser';
import { ActiveOrdersMerger } from './database-state-mergers/active-orders';
import { HistoryOrdersMerger } from './database-state-mergers/history-orders';

export const DATABASE_STATE = {
  ActiveOrders: {
    _depend: [
      walletState.USER_ADDR,
      walletState.NETWORK,
      P.Trade.Orders.Active.PageIndex,
      P.Trade.Orders.Active.PageSize,
    ],
    _merger: new ActiveOrdersMerger(),
  },
  HistoryOrders: {
    _depend: [
      walletState.USER_ADDR,
      walletState.NETWORK,
      P.Trade.Orders.History.PageIndex,
      P.Trade.Orders.History.PageSize,
    ],
    _merger: new HistoryOrdersMerger(),
  },
};
