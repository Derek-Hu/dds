import { Component } from "react";
import { Progress, Row, Col } from "antd";
import TradeBonus, { IRecord } from "../components/trade-bonus/index";
import TradeInfo from "../components/trade-info/index";
import TradePool from "../components/trade-pool/index";
import styles from "./style.module.less";

const data: IRecord[] = [
  {
    id: "001",
    time: new Date().getTime(),
    type: "Buy",
    price: 400.65,
    size: 10.36,
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: "LIQUIDATING",
    exercise: "-",
  },
  {
    id: "002",
    time: new Date().getTime(),
    type: "Buy",
    price: 400.65,
    size: 10.36,
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: "ACTIVE",
    exercise: "-",
  },
  {
    id: "003",
    time: new Date().getTime(),
    type: "Short",
    price: 400.65,
    size: 10.36,
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: 0.25,
    },
    status: "CLOSED",
    exercise: "-",
  },
];

export default class TradePage extends Component {
  componentDidMount() {
    console.log("mount");
  }
  render() {
    return (
      <div className={styles.tradeInfoPool}>
        <TradeBonus data={data} />
        <div style={{marginTop: '20px'}}>
          <Row gutter={20}>
            <Col span={16}>
              <TradePool />
            </Col>
            <Col span={8}>
              <TradeInfo />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
