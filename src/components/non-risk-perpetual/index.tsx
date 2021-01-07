import { Table } from "antd";
import styles from "./style.module.less";

const columns = [
  {
    title: "Coin",
    dataIndex: "coin",
    key: "coin",
  },
  {
    title: "Last Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "24h Change",
    dataIndex: "change",
    key: "change",
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
  },
];

const data = [
  {
    coin: "BTC",
    price: "7173.77",
    change: "8.23",
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
