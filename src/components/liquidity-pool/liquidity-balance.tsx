import Pool, { IPool } from "./pool";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import styles from "./style.module.less";

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
      <Pool {...BalancePool}>
        <Button type="primary" className={styles.btn}>
          Withdraw
        </Button>
        <p>Liquidity Balance Record</p>
      </Pool>
    </div>
  );
};
