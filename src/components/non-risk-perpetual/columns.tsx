import ColumnConvert from '../column-convert/index';
import styles from './style.module.less';
import { ICoins, ISupporttedUSD } from '../../constant';
export interface INonRiskPerpetual {
  fromCoin: ICoins;
  toCoin: ISupporttedUSD;
  price: number;
  change: number;
  chart?: string;
}

export default ColumnConvert<INonRiskPerpetual, { coin: any; action: any }>({
  column: {
    coin: 'Coin',
    price: <span className={styles.price}>Last Price</span>,
    change: <span className={styles.change}>24h Change</span>,
    // chart: "Chart",
    action: 'Action',
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
        return <span className={styles.tradeBtn}>Trade</span>;
      default:
        return value;
    }
  },
});
