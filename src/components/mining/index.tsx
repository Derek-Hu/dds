import { Component } from "react";
import { Tabs, Button, Progress } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import ProgressBar, { IBarData } from "../progress-bar/index";
import {CustomTabKey} from '../../constant/index';

const { TabPane } = Tabs;

const mining = {
  money: 530400,
  percentage: 70,
  ddsCount: 25000000,
};

const barData: IBarData = {
  left: {
    title: "Distributed today",
    percentage: 70,
  },
  right: {
    title: "Total daily amount",
    value: 25000000,
  },
  unit: 'DDS'
};

const utilization = {
  money: 530400,
  percentage: 90,
  ddsCount: 1000000,
};

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
          <Tabs defaultActiveKey="mining" className={CustomTabKey} onChange={this.callback}>
            <TabPane
              tab={<span className={styles.uppercase}>liquidity mining</span>}
              key="mining"
            >
              <h3>Liquidity Mining Reward Today</h3>
              <p className={styles.coins}>
                {numeral(mining.money).format("0,0")} DDS
              </p>
              <Button type="primary" className={styles.btn}>
                Connect Wallet
              </Button>
              <ProgressBar data={barData} />
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
              <p className={styles.coins}>
                {numeral(utilization.money).format("0,0")} DDS
              </p>
              <h4 className={styles.clockTitle}>Rewards Colck</h4>
              <p className={styles.rule}>
                Start liquidity utilization mining if there is no trading within
                30min
              </p>
              <div className={styles.cicleBar}>
                <Progress
                  type="circle"
                  width={160}
                  strokeWidth={20}
                  percent={70}
                  strokeColor="#1346FF"
                  strokeLinecap="square"
                  format={percent => `${percent} Days`} 
                />
              </div>
              <Button type="primary" className={styles.btn}>
                Connect Wallet
              </Button>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
