import { orderParser, orderPatcher, orderSerializer } from './cache-state-serializer';

export const CACHE_STATE = {
  Order: {
    NewCreate: {
      _key: '_pending_orders',
      _serializer: orderSerializer,
      _parser: orderParser,
      _patcher: orderPatcher,
    },
  },
};
