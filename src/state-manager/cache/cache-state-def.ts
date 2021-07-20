import { OrderItemData } from '../state-types';

export const CACHE_STATE = {
  Order: {
    NewCreate: {
      _key: '_pending_orders',
      _serializer: (state: OrderItemData[]) => JSON.stringify(state),
      _parser: (stateStr: string): OrderItemData[] | null => {
        try {
          return JSON.parse(stateStr);
        } catch (e) {
          return null;
        }
      },
    },
  },
};
