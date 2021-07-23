import {
  orderParser,
  orderPatcher,
  orderSerializer,
  tradeSettingParser,
  tradeSettingSerializer,
} from './cache-state-serializer';

export const CACHE_STATE = {
  Order: {
    NewCreate: {
      _key: '_pending_orders',
      _serializer: orderSerializer,
      _parser: orderParser,
      _patcher: orderPatcher,
    },
    NewClose: {
      _key: '_closing_orders',
      _serializer: orderSerializer,
      _parser: orderParser,
      _patcher: orderPatcher,
    },
    TradeSetting: {
      _key: '_trade_setting',
      _serializer: tradeSettingSerializer,
      _parser: tradeSettingParser,
    },
  },
};
