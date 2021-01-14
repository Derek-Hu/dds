import { Component } from "react";
import { Alert } from "antd";
import LiquidityPool from "../components/liquidity-pool/index";
import styles from "./style.module.less";

export default class PoolPage extends Component {
  componentDidMount() {
    console.log("mount");
  }
  render() {
    return (
      <div>
        <Alert className={styles.poolMsg} message="Private pool is extremely risky. If you are not a hedging expert, please stay away!!!" type="warning" />
        <LiquidityPool />
      </div>
    );
  }
}
