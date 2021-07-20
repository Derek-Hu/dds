import { walletState } from '../wallet/wallet-state';
import { P } from '../page/page-state-parser';
import { ActiveOrdersMerger } from './database-state-mergers/active-orders';

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
};
