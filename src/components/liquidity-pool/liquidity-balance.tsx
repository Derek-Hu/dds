import { Component } from "react";
import Pool, { IPool } from "./pool";
import { Tabs, Button, Modal, Table, Row, Select, Input } from "antd";
import styles from "./balance.module.less";
import ColumnConvert from "../column-convert/index";
import dayjs from "dayjs";
import numeral from "numeral";
import { CustomTabKey, SupportedCoins } from "../../constant/index";

const { TabPane } = Tabs;
const { Option } = Select;

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

interface ITransfer {
  time: number;
  type: "WithDraw" | "Deposit";
  amount: number;
  balance: number;
}

const columns = ColumnConvert<ITransfer, {}>({
  column: {
    time: "Time",
    type: "Type",
    amount: "Amount",
    balance: "Balance",
  },
  render(value, key) {
    switch (key) {
      case "time":
        return dayjs(value).format("YYYY-MM-DD");
      case "amount":
      case "balance":
        return numeral(value).format("0,0.0000");
      default:
        return value;
    }
  },
});

const data: ITransfer[] = [
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: "WithDraw",
    amount: 100,
    balance: 892.03,
  },
];
export default class PoolPage extends Component {
  state = {
    withDrawVisible: false,
    recordVisible: false,
  };

  showRecord = () => {
    this.setState({
      recordVisible: true,
    });
  };
  closeRecord = () => {
    this.setState({
      recordVisible: false,
    });
  };

  showWithDraw = () => {
    this.setState({
      withDrawVisible: true,
    });
  };
  closeWithDraw = () => {
    this.setState({
      withDrawVisible: false,
    });
  };

  render() {
    return (
      <div>
        <Pool {...BalancePool} smallSize={true}>
          <Button
            type="primary"
            onClick={this.showWithDraw}
            className={styles.btn}
          >
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
          <Tabs defaultActiveKey={TabName.Transfer} className={CustomTabKey}>
            <TabPane
              tab={<span className={styles.uppercase}>{TabName.Transfer}</span>}
              key={TabName.Transfer}
            >
              <Tabs defaultActiveKey="DAI" className={styles.innerTab}>
                {SupportedCoins.map((coin) => (
                  <TabPane tab={coin} key={coin}>
                    <Table
                      rowKey="coin"
                      scroll={{ y: 300 }}
                      columns={columns}
                      pagination={false}
                      dataSource={data}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
            <TabPane
              tab={<span className={styles.uppercase}>{TabName.PNL}</span>}
              key={TabName.PNL}
            >
              <Tabs defaultActiveKey="DAI" className={styles.innerTab}>
                {SupportedCoins.map((coin) => (
                  <TabPane tab={coin} key={coin}>
                    <Table
                      rowKey="coin"
                      scroll={{ y: 300 }}
                      columns={columns}
                      pagination={false}
                      dataSource={data}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </TabPane>
          </Tabs>
        </Modal>

        <Modal
          visible={this.state.withDrawVisible}
          title="Liquidity Withdraw"
          className={styles.modal}
          okText={'Claim'}
          onCancel={this.closeWithDraw}
        >
          <Row>
            <Select
              defaultValue="DAI"
              style={{ width: 120, height: 50 }}
              className={styles.coinDropdown}
            >
              {SupportedCoins.map((coin) => (
                <Option value={coin}>{coin}</Option>
              ))}
            </Select>
            <span className={styles.maxWithdraw}>Max Withdraw Balance: <span>3278392</span> DAI</span>
          </Row>
          <Row className={styles.repay}>
            <Input placeholder="Withdraw amount" />
            <p>XXX reDAI you need to pay</p>
          </Row>
        </Modal>
      </div>
    );
  }
}
