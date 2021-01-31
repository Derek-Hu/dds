import { Component } from "react";
import { Tabs, Button, Input, Row, Col, Select, Table } from "antd";
import styles from "./style.module.less";
import commonStyles from "../funding-balance/modals/style.module.less";
import numeral from "numeral";
import dayjs from "dayjs";
import ProgressBar, { IBarData } from "../progress-bar/index";
import { CustomTabKey, SupportedCoins } from "../../constant/index";
import Pool, { IPool } from "../liquidity-pool/pool";
import PoolProgress, { IMiningShare } from "../progress-bar/pool-progress";
import ColumnConvert from "../column-convert/index";
import ModalRender from "../modal-render/index";
import currStyles from "../trade-bonus/modals/style.module.less";

const { Option } = Select;
const { TabPane } = Tabs;
const style = {
  color: "#1346FF",
  fontSize: "18px",
};

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
  unit: "DDS",
};

const utilization = {
  money: 530400,
  percentage: 90,
  ddsCount: 1000000,
};

const ReTokenBalance: IPool = {
  title: "Your reToken Balance",
  usd: 748830,
  coins: [
    {
      name: "reDAI",
      value: 647,
    },
    {
      name: "reUSDC",
      value: 638,
    },
    {
      name: "reUSDT",
      value: 7378,
    },
  ],
};

const LockBalance: IPool = {
  title: "Locked",
  usd: 748830,
  coins: [
    {
      name: "reDAI",
      value: 647,
    },
    {
      name: "reUSDC",
      value: 638,
    },
    {
      name: "reUSDT",
      value: 7378,
    },
  ],
};

interface IReward {
  time: number;
  pair: {
    from: "ETH";
    to: "DAI";
  };
  price: number;
  amount: number;
  reward: number;
}
const columns = ColumnConvert<IReward, {}>({
  column: {
    time: "Time",
    pair: "Coin Pair",
    amount: "Amount",
    price: "Order Price",
    reward: "Reward(DDS)",
  },
  render(value, key, record) {
    switch (key) {
      case "time":
        return dayjs(value).format("YYYY-MM-DD");
      case "pair":
        const { from, to } = record[key];
        return from + "/" + to;
      case "amount":
      case "price":
      case "reward":
        return numeral(value).format("0,0.0000");
      default:
        return value;
    }
  },
});

const data: IReward[] = [
  {
    time: new Date().getTime(),
    pair: {
      from: "ETH",
      to: "DAI",
    },
    price: 32432,
    amount: 32,
    reward: 32,
  },
];
const MiningShare: IMiningShare = {
  title: "Your Liauidity Mining share",
  desc: (
    <p className={styles.shareTotalTip}>
      <span>
        Your
        <br />
        share
      </span>
      <span>
        Total
        <br />
        Locked
      </span>
    </p>
  ),
  coins: [
    {
      label: "reDAI",
      percentage: 25,
      // val: <span>37863/ 65349</span>,
    },
    {
      label: "reUSDC",
      percentage: 75,
      // val: <span>37863/ 65349</span>,
    },
    {
      label: "reUSDT",
      percentage: 55,
      // val: <span>37863/ 65349</span>,
    },
  ],
  totalMode: true,
};
export default class Mining extends Component {
  componentDidMount() {}

  state = {
    visible: false,
    isLogin: true,
    isUnlockType: false,
    claimModalVisible: false,
    lockReModalVisible: false,
  };

  showWithDraw = () => {
    this.setState({
      visible: true,
    });
  };
  closeWithDraw = () => {
    this.setState({
      visible: false,
    });
  };
  showLockModal = (isUnlockType: boolean) => {
    this.setState({
      lockReModalVisible: true,
      isUnlockType,
    });
  };
  closeLockModal = () => {
    this.setState({
      lockReModalVisible: false,
    });
  };

  showClaimModal = () => {
    this.setState({
      claimModalVisible: true,
    });
  };
  closeClaimModal = () => {
    this.setState({
      claimModalVisible: false,
    });
  };

  callback(key: string) {
    console.log(key);
  }

  render() {
    const {
      visible,
      isLogin,
      claimModalVisible,
      lockReModalVisible,
      isUnlockType,
    } = this.state;

    return (
      <div className={styles.root}>
        <h2>Mining</h2>
        <div className={styles.tabContainer}>
          <Tabs
            defaultActiveKey="mining"
            className={CustomTabKey}
            onChange={this.callback}
          >
            <TabPane
              tab={<span className={styles.uppercase}>liquidity mining</span>}
              key="mining"
            >
              <h3>Liquidity Mining Reward Today</h3>
              <p className={styles.coins}>
                {numeral(mining.money).format("0,0")} DDS
              </p>
              {isLogin ? (
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={this.showClaimModal}
                >
                  Claim
                </Button>
              ) : (
                <Button type="primary" className={styles.btn}>
                  Connect Wallet
                </Button>
              )}

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
              {/* <h4 className={styles.clockTitle}>Rewards Colck</h4>
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
                  format={(percent) => `${percent} Days`}
                />
              </div>
               */}
              {isLogin ? (
                <div>
                  <Button
                    type="primary"
                    className={[styles.btn, styles.cliamBtn].join(" ")}
                    onClick={this.showClaimModal}
                  >
                    Claim
                  </Button>
                  <div>
                    <Button
                      type="link"
                      onClick={this.showWithDraw}
                      className={styles.recordLink}
                    >
                      Reward record
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="primary" className={styles.btn}>
                  Connect Wallet
                </Button>
              )}
            </TabPane>
          </Tabs>
          
          <ModalRender
            visible={claimModalVisible}
            onCancel={this.closeClaimModal}
            footer={null}
            title="Claim Rewards"
            className={commonStyles.commonModal}
          >
            <Row type="flex" justify="space-between" align="middle">
              <Col xs={20} sm={20} md={20} lg={20}>
                <Input placeholder="Amount you want to claim" />
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: "center" }}>
                <span>DDS</span>
              </Col>
            </Row>
            <p className={currStyles.tips}>
              Total Amount: 10.36 <Button type="link">Close All</Button>
            </p>
            <Row className={commonStyles.actionBtns} gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Button>Cancel</Button>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Button type="primary">Claim</Button>
              </Col>
            </Row>
          </ModalRender>
          <ModalRender
            visible={lockReModalVisible}
            onCancel={this.closeLockModal}
            footer={null}
            title={isUnlockType ? "Unlock reTokens" : "Lock reTokens"}
            className={commonStyles.commonModal}
          >
            <Row gutter={16} type="flex" justify="space-between" align="middle">
              <Col xs={24} sm={24} md={6} lg={6}>
                <Select
                  defaultValue="DAI"
                  style={{ width: "100%", height: 50 }}
                >
                  {SupportedCoins.map((coin) => (
                    <Option value={coin}>{coin}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={18} lg={18}>
                <span className={commonStyles.maxWithdraw}>
                  Max Amount: <span>3278392</span> DAI
                </span>
              </Col>
            </Row>
            <Row className={commonStyles.repay}>
              <Col>
                <Input
                  placeholder={`Amount for ${
                    isUnlockType ? "unlocking" : "locking"
                  }`}
                />
              </Col>
            </Row>
            <Row gutter={16} className={commonStyles.actionBtns}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Button>Cancel</Button>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Button type="primary">Confirm</Button>
              </Col>
            </Row>
          </ModalRender>
          <ModalRender
            visible={visible}
            title="Rewards Record"
            className={styles.modal}
            onCancel={this.closeWithDraw}
            footer={null}
          >
            <Table
              scroll={{ y: 300 }}
              columns={columns}
              pagination={false}
              dataSource={data}
            />
          </ModalRender>
        </div>
        {isLogin ? <div className={styles.panels}>
            <Row gutter={24} style={{ marginTop: "40px" }}>
              <Col span={8}>
                <Pool {...ReTokenBalance} smallSize={true}>
                  <Button
                    type="primary"
                    className={styles.lock}
                    onClick={() => this.showLockModal(false)}
                  >
                    Lock reTokens
                  </Button>
                  <p>Lock reTokens to start receving rewards inDDS tokens</p>
                </Pool>
              </Col>
              <Col span={8}>
                <Pool {...LockBalance} smallSize={true}>
                  <Button
                    type="primary"
                    className={styles.lock}
                    onClick={() => this.showLockModal(true)}
                  >
                    Unlock reTokens
                  </Button>
                  <p>
                    Unlock reToken to be able to withdraw your reToken from the
                    liquidity mining
                  </p>
                </Pool>
              </Col>
              <Col span={8}>
                <PoolProgress {...MiningShare} />
              </Col>
            </Row>
          </div> : null}
      </div>
    );
  }
}
