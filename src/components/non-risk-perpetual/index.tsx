import { Table } from "antd";
import styles from "./style.module.less";

const columns = [
  {
    title: "Coin",
    dataIndex: "coin",
    key: "coin",
    render: (coin: string) => {
        return <span>
            <span className={styles.coin}>{coin}</span><span className={styles.usdt}> / USDT</span>
        </span>
    }
  },
  {
    title: <span  className={styles.price}>Last Price</span>,
    dataIndex: "price",
    key: "price",
    render: (price: number) => <span className={styles.priceVal}>{price}</span>
  },
  {
    title: <span  className={styles.change}>24h Change</span>,
    dataIndex: "change",
    key: "change",
    width: '10em',
    render: (percentage: any) => <span className={[styles.changeVal, percentage<0 ? styles.negative: ''].join(' ')}>{percentage>0?'+':''}{percentage}%</span>
  },
  {
    title: "Chart",
    dataIndex: "chart",
    key: "chart",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: '6em'
  },
];

const data = [
  {
    coin: "BTC",
    price: "7173.77",
    change: 8.23,
  },
  {
    coin: "ETH",
    price: "183.28",
    change: -10.01,
  },
];

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.head}>
          <h2>Non-Risk Perpetual <span>24h trading volumn: 82,323,123 USD</span></h2>
        </div>
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
    </div>
  );
};
