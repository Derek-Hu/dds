import Pool, { IPool } from "./pool";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import styles from "./balance.module.less";

const BalancePool: IPool = {
  title: "Liquidity Balance",
  usd: 748830,
  coins: [
    {
      name: "DAI",
      value: 647,
    },
    {
      name: "USDC",
      value: 638,
    },
    {
      name: "USDT",
      value: 7378,
    },
  ],
};

export default () => {
  return (
    <div>
      <Pool {...BalancePool} smallSize={true}>
        <Button type="primary" className={styles.btn}>
          Withdraw
        </Button>
        <Button type="link" className={styles.link}>
          Liquidity Balance Record
        </Button>
      </Pool>
    </div>
  );
};
