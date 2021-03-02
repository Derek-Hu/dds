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



export default ({children}: {children?: any}) => {
  return (
    <Pool {...NetPool}>
      {children}
    </Pool>
  );
};
