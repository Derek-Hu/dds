import { Table, Row, Col } from "antd";
import styles from "./style.module.less";

const columns = [
  {
    title: "Coin",
    dataIndex: "coin",
    key: "coin",
    render: (coin: string) => {
      return (
        <span>
          <span className={styles.coin}>{coin}</span>
          <span className={styles.usdt}> / USDT</span>
        </span>
      );
    },
  },
  {
    title: <span className={styles.price}>Last Price</span>,
    dataIndex: "price",
    key: "price",
    render: (price: number) => <span className={styles.priceVal}>{price}</span>,
  },
  {
    title: <span className={styles.change}>24h Change</span>,
    dataIndex: "change",
    key: "change",
    width: "10em",
    render: (percentage: any) => (
      <span
        className={[
          styles.changeVal,
          percentage < 0 ? styles.negative : "",
        ].join(" ")}
      >
        {percentage > 0 ? "+" : ""}
        {percentage}%
      </span>
    ),
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
    width: "6em",
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

const total = 82323123;
export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.head}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} className={styles.col}>
              <h2>Non-Risk Perpetual</h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}  className={[styles.col, styles.summary].join(' ')}>
              <span>24h trading volumn: <span className={styles.total}>{total}</span> USD</span>
            </Col>
          </Row>
        </div>
        <Table columns={columns} pagination={false} dataSource={data} />
      </div>
    </div>
  );
};
