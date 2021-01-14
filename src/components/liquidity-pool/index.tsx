import { Component } from "react";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import Pool, { IPool } from "./pool";
import Balance from "./liquidity-balance";
import FillGrid from "../fill-grid";
import MiningShare from "./mining-share";
import SharePool from "./share-pool";
import AvailablePool from './available-pool';
import NetPL from './net-pl';
const { Option } = Select;
const { TabPane } = Tabs;

const mining = {
  money: 530400,
  percentage: 70,
  ddsCount: 25000000,
};

const TabName = {
  Collaborative: "Collaborative Pool",
  Private: "Private Pool",
};

const ProvidedPool: IPool = {
  title: "Liquidity Provided",
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

const PrivatePool = {
  title: "PRIVATE POOL",
  usd: 734890,
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
export default class PoolArea extends Component {
  componentDidMount() {}

  callback(key: string) {
    console.log(key);
  }

  render() {
    return (
      <div className={styles.root}>
        <h2>LIQUIDITY POOL</h2>
        <div className={styles.tabContainer}>
          <Tabs
            defaultActiveKey={TabName.Collaborative}
            onChange={this.callback}
          >
            <TabPane
              tab={
                <span className={styles.uppercase}>
                  {TabName.Collaborative}
                </span>
              }
              key={TabName.Collaborative}
            >
              <h3>ARP</h3>
              <p className={styles.coins}>
                {numeral(mining.money).format("0,0")}%
              </p>

              <div className={styles.actionArea}>
                <FillGrid
                  left={
                    <Select
                      defaultValue="lucy"
                      style={{ width: 120, height: 50 }}
                      className={styles.coinDropdown}
                      // onChange={handleChange}
                    >
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>
                        Disabled
                      </Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  }
                  right={
                    <Input placeholder="amount for providing to the pool" />
                  }
                />
                <p className={styles.cal}>
                  You Will Receive: <span>94204</span> reDAI
                </p>
                <Button type="primary" className={styles.btn}>
                  Connect Wallet
                </Button>
              </div>
              <Row gutter={24}>
                <Col span={8}>
                  <Pool {...ProvidedPool} />
                </Col>
                <Col span={8}>
                  <Pool {...NetPool} />
                </Col>
                <Col span={8}>
                  <SharePool />
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={<span className={styles.uppercase}>{TabName.Private}</span>}
              key={TabName.Private}
            >
              <div
                className={[styles.actionArea, styles.privateArea].join(" ")}
              >
                <FillGrid
                  left={
                    <Select
                      defaultValue="lucy"
                      style={{ width: 120, height: 50 }}
                      className={styles.coinDropdown}
                      // onChange={handleChange}
                    >
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>
                        Disabled
                      </Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  }
                  right={
                    <Input placeholder="amount for providing to the pool" />
                  }
                />
                <Button type="primary" className={styles.btn}>
                  Connect Wallet
                </Button>
              </div>
              <Row gutter={24}>
                <Col span={8}>
                  <MiningShare />
                </Col>
                <Col span={8}>
                  <Pool {...PrivatePool} />
                </Col>
                <Col span={8}>
                  <Balance />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <AvailablePool />
                </Col>
                <Col span={12}>
                  <NetPL />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
