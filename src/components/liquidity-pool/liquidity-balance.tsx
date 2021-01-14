import { Component } from "react";
import Pool, { IPool } from "./pool";
import { Tabs, Button, Modal, Col, Select, Input } from "antd";
import styles from "./balance.module.less";

const { TabPane } = Tabs;

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

const TabName = {
  Transfer: "Transfer",
  PNL: "PNL",
};


export default class PoolPage extends Component {
  
  state = {
    withDrawVisible: false,
    recordVisible: false,
  }

  showRecord = () => {
    this.setState({
      recordVisible: true
    })
  }
  closeRecord = () => {
    this.setState({
      recordVisible: false
    })
  }

  showWithDraw = () => {
    this.setState({
      withDrawVisible: true
    })
  }
  closeWithDraw = () => {
    this.setState({
      withDrawVisible: false
    })
  }

  render() {
    return (
      <div>
        <Pool {...BalancePool} smallSize={true}>
          <Button type="primary" onClick={this.showWithDraw} className={styles.btn}>
            Withdraw
          </Button>
          <Button type="link" onClick={this.showRecord} className={styles.link}>
            Liquidity Balance Record
          </Button>
        </Pool>

        <Modal
          visible={this.state.recordVisible}
          title="Liquidity Balance Record"
          className={styles.modal}
          onCancel={this.closeRecord}
          footer={null}
        >
          <Tabs
            defaultActiveKey={TabName.Transfer}
          >
            <TabPane
              tab={
                <span className={styles.uppercase}>
                  {TabName.Transfer}
                </span>
              }
              key={TabName.Transfer}
            ></TabPane>
            <TabPane
              tab={
                <span className={styles.uppercase}>
                  {TabName.PNL}
                </span>
              }
              key={TabName.PNL}
            ></TabPane>
          </Tabs>

        </Modal>

        <Modal
          visible={this.state.withDrawVisible}
          title="Liquidity Withdraw"
          className={styles.modal}
          onCancel={this.closeWithDraw}
        ></Modal>
      </div>
    );
  }
}
