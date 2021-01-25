import { Component } from "react";
import { Tabs, Button, Row, Col, Select, Input, Alert } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import Pool, { IPool } from "./pool";
import Balance from "./liquidity-balance";
import FillGrid from "../fill-grid";
import MiningShare from "./mining-share";
import SharePool from "./share-pool";
import AvailablePool from "./available-pool";
import NetPL from "./net-pl";
import { CustomTabKey, CoinSelectOption } from "../../constant/index";

const { Option } = Select;
const { TabPane } = Tabs;

const mining = {
  money: 530400,
  percentage: 70,
  ddsCount: 25000000,
};

const TabName = {
  Collaborative: "Collaborative",
  Private: "Private",
};

const PublicProvidedPool: IPool = {
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

const PublicNetPool: IPool = {
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
export default class PoolArea extends Component<{ isLogin: boolean }, any> {
  state = {
    selectedTab: TabName.Collaborative,
  };
  componentDidMount() {}

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    const { isLogin } = this.props;
    const { selectedTab } = this.state;
    return (
      <>
        {isLogin && selectedTab === TabName.Private ? (
          <Alert
            className={styles.poolMsg}
            message="Private pool is extremely risky. If you are not a hedging expert, please stay away!!!"
            type="warning"
          />
        ) : null}
        <div className={styles.root}>
          <h2>LIQUIDITY POOL</h2>
          <div className={styles.tabContainer}>
            <Tabs
              className={CustomTabKey}
              defaultActiveKey={selectedTab}
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
                        defaultValue="DAI"
                        style={{ width: 120, height: 50 }}
                        className={styles.coinDropdown}
                        // onChange={handleChange}
                      >
                        {CoinSelectOption}
                      </Select>
                    }
                    right={
                      <Input placeholder="amount for providing to the pool" />
                    }
                  />
                  <p className={styles.cal}>
                    You Will Receive: <span>94204</span> reDAI
                  </p>
                  {isLogin ? (
                    <Button type="primary" className={styles.btn}>
                      Deposit
                    </Button>
                  ) : (
                    <Button type="primary" className={styles.btn}>
                      Connect Wallet
                    </Button>
                  )}
                </div>
                {isLogin ? (
                  <Row gutter={24}>
                    <Col span={8}>
                      <SharePool />
                    </Col>
                    <Col span={8}>
                      <Balance />
                    </Col>
                    <Col span={8}>
                      <NetPL />
                    </Col>
                  </Row>
                ) : (
                  <Row gutter={24}>
                    <Col span={12}>
                      <Pool {...PublicProvidedPool} />
                    </Col>
                    <Col span={12}>
                      <Pool {...PublicNetPool} />
                    </Col>
                  </Row>
                )}
              </TabPane>
              <TabPane
                tab={
                  <span className={styles.uppercase}>{TabName.Private}</span>
                }
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
                        {CoinSelectOption}
                      </Select>
                    }
                    right={
                      <Input placeholder="amount for providing to the pool" />
                    }
                  />
                  {isLogin ? (
                    <Button type="primary" className={styles.btn}>
                      Deposit
                    </Button>
                  ) : (
                    <Button type="primary" className={styles.btn}>
                      Connect Wallet
                    </Button>
                  )}
                </div>
                {isLogin ? (
                  <Row gutter={24}>
                    <Col span={8}>
                      <AvailablePool />
                    </Col>
                    <Col span={8}>
                      <Balance />
                    </Col>
                    <Col span={8}>
                      <NetPL />
                    </Col>
                  </Row>
                ) : (
                  <Row gutter={24}>
                    <Col span={12}>
                      <AvailablePool />
                    </Col>
                    <Col span={12}>
                      <Pool {...PublicProvidedPool} />
                    </Col>
                  </Row>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}
