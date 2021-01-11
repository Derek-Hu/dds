import { Component } from "react";
import { Progress, Tabs, Row, Col } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";

const { TabPane } = Tabs;

const mining = {
    money: 530400,
    percentage: 70,
    ddsCount: 25000000
}

const utilization = {
    money: 400,
    percentage: 90,
    ddsCount: 1000000
}

export default class Mining extends Component {
  componentDidMount() {}

  callback(key: string) {
    console.log(key);
  }

  render() {
    return (
      <div className={styles.root}>
        <h2>Mining</h2>
        <div className={styles.tabContainer}>
          <Tabs defaultActiveKey="mining" onChange={this.callback}>
            <TabPane
              tab={<span className={styles.uppercase}>liquidity mining</span>}
              key="mining"
            >
              <h3>Liquidity Mining Reward Today</h3>
              <p className={styles.coins}>{numeral(mining.money).format("0,0")} DDS</p>
              <span className={styles.btn}>Connect Wallet</span>
              <Row>
                <Col span={12} className={styles.left}>
                  <span className={styles.today}>Distributed today:</span>
                  <br />
                  <span className={styles.percentage}>
                    {mining.percentage}%
                  </span>
                </Col>
                <Col span={12} className={styles.right}>
                  <span className={styles.amount}>Total daily amount:</span>
                  <br />
                  <span className={styles.dds}>{mining.ddsCount}</span>&nbsp;
                  <span className={styles.unit}>DDS</span>
                </Col>
              </Row>
              <Progress
                percent={mining.percentage}
                strokeColor={{ from: "#0072F4", to: "#0055FF" }}
                strokeWidth={20}
                showInfo={false}
                strokeLinecap="square"
              />
              <p className={styles.fifo}>First come first served</p>
            </TabPane>
            <TabPane
              tab={
                <span className={styles.uppercase}>
                  liquidity utilization mining
                </span>
              }
              key="utilization"
            >
              <h3>Liquidity Utilization Mining Reward Today</h3>
              <p className={styles.coins}>{numeral(utilization.money).format("0,0")} DDS</p>
              <span className={styles.btn}>Connect Wallet</span>
              <Row>
                <Col span={12} className={styles.left}>
                  <span className={styles.today}>Distributed today:</span>
                  <br />
                  <span className={styles.percentage}>
                    {utilization.percentage}%
                  </span>
                </Col>
                <Col span={12} className={styles.right}>
                  <span className={styles.amount}>Total daily amount:</span>
                  <br />
                  <span className={styles.dds}>{utilization.ddsCount}</span>&nbsp;
                  <span className={styles.unit}>DDS</span>
                </Col>
              </Row>
              <Progress
                percent={utilization.percentage}
                strokeColor={{ from: "#0072F4", to: "#0055FF" }}
                strokeWidth={20}
                showInfo={false}
                strokeLinecap="square"
              />
              <p className={styles.fifo}>First come first served</p>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
