import Pool, { IPool } from "./pool";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import styles from './net.module.less';

const NetPool: IPool = {
  title: "Net P&L",
  usd: 637,
  coins: [
    {
      name: "DAI",
      value: 74,
    },
    {
      name: "USDC",
      value: 3,
    },
    {
      name: "USDT",
      value: 445,
    },
  ],
};

const rates = [-53, 1453, 0];

export default () => {
  return (
    <Pool {...NetPool}>
      <Row>
          {
              rates.map(val => <Col className={styles.rate} span={8}>{val}%</Col>)
          }
      </Row>
    </Pool>
  );
};
