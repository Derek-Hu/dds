import { Component } from "react";
import {
  Tabs,
  Button,
  Row,
  Col,
  Select,
  Input,
  Alert,
  Descriptions,
} from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import Pool, { IPool } from "./pool";
import Balance from "./liquidity-balance";
import FillGrid from "../fill-grid";
import commonStyles from "../funding-balance/modals/style.module.less";
import SharePool from "./share-pool";
import AvailablePool from "./available-pool";
import NetPL from "./net-pl";
import { CustomTabKey, CoinSelectOption } from "../../constant/index";
import ModalRender from "../modal-render/index";
import SiteContext from "../../layouts/SiteContext";
import LockedDetails, { ILockedData } from '../liquidity-pool/locked-details';

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


const lockedData: ILockedData[] = [
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed'
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed'
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed'
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed'
  },
];

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

const rates = [-53, 1453, 0];
export default class PoolArea extends Component<{ isLogin: boolean }, any> {
  state = {
    selectedTab: TabName.Collaborative,
    depositModalVisible: false,
  };
  componentDidMount() {}

  closeDepositModal = () => {
    this.setState({
      depositModalVisible: false,
    });
  };

  showDepositModal = () => {
    this.setState({
      depositModalVisible: true,
    });
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    const { isLogin } = this.props;
    const { selectedTab } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <div
              className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}
            >
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

                    { isLogin ? <div className={styles.actionArea}>
                      <Row gutter={[isMobile? 0: 12, isMobile? 15: 0]}>
                        <Col xs={24} sm={24} md={8} lg={6}><Select
                            defaultValue="DAI"
                            style={{ width: '100%', height: 50 }}
                            className={styles.coinDropdown}
                            // onChange={handleChange}
                          >
                            {CoinSelectOption}
                          </Select></Col>
                        <Col xs={24} sm={24} md={16} lg={18}>
                        <Input placeholder="amount for providing to the pool" />
                        </Col>
                      </Row>
                      <p className={styles.cal}>
                        You Will Receive: <span>94204</span> reDAI
                      </p>
                      <Button
                        type="primary"
                        className={styles.btn}
                        onClick={this.showDepositModal}
                      >
                        Deposit
                      </Button>
                    </div> : null }
                  </TabPane>
                  <TabPane
                    tab={
                      <span className={styles.uppercase}>
                        {TabName.Private}
                      </span>
                    }
                    key={TabName.Private}
                  >
                    {isLogin && selectedTab === TabName.Private ? (
                      <Alert
                        className={styles.poolMsg}
                        message="Private pool is extremely risky. If you are not a hedging expert, please stay away!!!"
                        type="warning"
                      />
                    ) : null}
                    <div
                      className={[styles.actionArea, styles.privateArea].join(
                        " "
                      )}
                    >
                      <Row gutter={[isMobile? 0: 12, isMobile? 15: 0]}>
                        <Col xs={24} sm={24} md={8} lg={6}><Select
                            defaultValue="DAI"
                            style={{ width: '100%', height: 50 }}
                            className={styles.coinDropdown}
                            // onChange={handleChange}
                          >
                            {CoinSelectOption}
                          </Select></Col>
                        <Col xs={24} sm={24} md={16} lg={18}>
                        <Input placeholder="amount for providing to the pool" />
                        </Col>
                      </Row>
                      {isLogin ? (
                        <Button
                          type="primary"
                          className={styles.btn}
                          onClick={this.showDepositModal}
                        >
                          Deposit
                        </Button>
                      ) : (
                        <Button type="primary" className={styles.btn}>
                          Connect Wallet
                        </Button>
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
              <div className={styles.panels}>
                {selectedTab === TabName.Collaborative ? (
                  <div>
                    {isLogin ? (
                      <Row gutter={isMobile? 0: 12}>
                        <Col xs={24} sm={24} md={8} lg={8}>
                          <SharePool />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                          <Balance />
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                          <NetPL />
                        </Col>
                      </Row>
                    ) : (
                      <Row gutter={isMobile? 0: 12}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <Pool {...PublicProvidedPool} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <Pool {...PublicNetPool} />
                        </Col>
                      </Row>
                    )}
                  </div>
                ) : null}
                {selectedTab === TabName.Private ? (
                  <div>
                    {isLogin ? <div>
                        <Row gutter={isMobile? 0: 12}>
                          <Col  xs={24} sm={24} md={8} lg={8}>
                            <AvailablePool />
                          </Col>
                          <Col  xs={24} sm={24} md={8} lg={8}>
                            <Balance />
                          </Col>
                          <Col  xs={24} sm={24} md={8} lg={8}>
                            <NetPL>
                            <Row>
                                {
                                    rates.map(val => <Col className={styles.rate} span={8}>{val}%</Col>)
                                }
                            </Row>
                            </NetPL>
                          </Col>
                        </Row>
                        <LockedDetails data={lockedData} />
                      </div> : (
                      <Row gutter={isMobile? 0: 12}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <AvailablePool />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <Pool {...PublicProvidedPool} />
                        </Col>
                      </Row>
                    )}
                  </div>
                ) : null}
              </div>
              <ModalRender
                visible={this.state.depositModalVisible}
                title="Comfirm Deposit"
                className={commonStyles.commonModal}
                onCancel={this.closeDepositModal}
                height={300}
                footer={null}
              >
                <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                  <Descriptions.Item label="Deposit Amount" span={24}>
                    10.36 DAI
                  </Descriptions.Item>
                  {
                    selectedTab === TabName.Private ? null : <Descriptions.Item label="Receive" span={24}>
                    10.36 reDAI
                  </Descriptions.Item>
                  }
                </Descriptions>
                {
                    selectedTab === TabName.Private ? null : <p>说明：将冻结14天</p>
                  }
                <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button type="primary">Comfirm</Button>
                  </Col>
                </Row>
              </ModalRender>
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
