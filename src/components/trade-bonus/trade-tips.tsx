import { formatMessage } from 'locale/i18n';

export const orderTips = (txs: string[]) =>
  txs.map(tx => (
    <span>
      {formatMessage({ id: 'order-id-canceled', tx })} <br />
    </span>
  ));
