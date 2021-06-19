import ColumnConvert from '../column-convert/index';
import styles from './style.module.less';
import { ICoins, ddsBasePath } from '../../constant';
import { formatMessage } from '~/util/i18n';

export default ColumnConvert<INonRiskPerpetual, { coin: any; action: any }>({
  column: {
    coin: formatMessage({ id: 'coin' }),
    price: <span className={styles.price}>{formatMessage({ id: 'last-price' })}</span>,
    change: <span className={styles.change}>{formatMessage({ id: '24h-change' })}</span>,
    // chart: "Chart",
    action: formatMessage({ id: 'action' }),
  },
  render(value, key, record) {
    switch (key) {
      case 'coin':
        return (
          <span>
            <span className={styles.coin}>{record.fromCoin}</span>
            <span className={styles.usdt}> / {record.toCoin}</span>
          </span>
        );
      case 'price':
        return <span className={styles.priceVal}>{value}</span>;
      case 'change':
        return (
          <span className={[styles.changeVal, value < 0 ? styles.negative : ''].join(' ')}>
            {value > 0 ? '+' : ''}
            {value}%
          </span>
        );
      case 'action':
        return (
          <span className={styles.tradeBtn}>
            <a href={`${ddsBasePath}/trade?fromCoin=${record.fromCoin}&toCoin=${record.toCoin}`}>
              {formatMessage({ id: 'trade' })}
            </a>
          </span>
        );
      default:
        return value;
    }
  },
});
