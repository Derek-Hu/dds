import { Component } from 'react';
import { Tabs, Button, Input, Row, Col, Select, Table } from 'antd';
import styles from './style.module.less';
import commonStyles from '../funding-balance/modals/style.module.less';
import numeral from 'numeral';
import dayjs from 'dayjs';
import ProgressBar, { IBarData } from '../progress-bar/index';
import { CustomTabKey, SupportedCoins } from '../../constant/index';
import Pool, { IPool } from '../liquidity-pool/pool';
import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';
import ColumnConvert from '../column-convert/index';
import ModalRender from '../modal-render/index';
import currStyles from '../trade-bonus/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import LockedDetails, { ILockedData } from '../liquidity-pool/locked-details';
import SystemRanking from './system-ranking';
import CardInfo from '../card-info/index';

const { Option } = Select;
const { TabPane } = Tabs;

const SystemFundBalance = {
  title: 'System Fund Balance',
  // desc: <span>Total Liquidity: <span style={style}>23534.33</span> USD</span>,
  items: [
    {
      label: 'DAI',
      value: <span>647</span>,
    },
    {
      label: 'USDC',
      value: <span>638</span>,
    },
    {
      label: 'USDT',
      value: <span>7378</span>,
    },
  ],
};

const TabName = {
  Liquidity: 'liquidity',
  Utilization: 'liquidity locked',
  Liquiditor: 'liquiditor',
};

const mining = {
  money: 530400,
  percentage: 70,
  ddsCount: 25000000,
};

// const barData: IBarData = {
//   left: {
//     title: 'Distributed today',
//     percentage: 70,
//   },
//   right: {
//     title: 'Total daily amount',
//     value: 25000000,
//   },
//   unit: 'DDS',
// };

const utilization = {
  money: 530400,
  percentage: 90,
  ddsCount: 1000000,
};

const ReTokenBalance = {
  title: 'Your reToken Balance',
  items: [
    {
      label: 'reDAI',
      value: 647,
    },
    {
      label: 'reUSDC',
      value: 638,
    },
    {
      label: 'reUSDT',
      value: 7378,
    },
  ],
};

const LockBalance: IPool = {
  title: 'Locked',
  usd: 748830,
  coins: [
    {
      label: 'reDAI',
      value: 647,
    },
    {
      label: 'reUSDC',
      value: 638,
    },
    {
      label: 'reUSDT',
      value: 7378,
    },
  ],
};

interface IReward {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
  reward: number;
}
const columns = ColumnConvert<IReward, {}>({
  column: {
    time: 'Time',
    pair: 'Coin Pair',
    amount: 'Amount',
    price: 'Order Price',
    reward: 'Reward(DDS)',
  },
  render(value, key, record) {
    switch (key) {
      case 'time':
        return dayjs(value).format('YYYY-MM-DD');
      case 'pair':
        const { from, to } = record[key];
        return from + '/' + to;
      case 'amount':
      case 'price':
      case 'reward':
        return numeral(value).format('0,0.0000');
      default:
        return value;
    }
  },
});

const data: IReward[] = [
  {
    time: new Date().getTime(),
    pair: {
      from: 'ETH',
      to: 'DAI',
    },
    price: 32432,
    amount: 32,
    reward: 32,
  },
];
const MiningShare: IMiningShare = {
  title: 'Your Liauidity Mining share',
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
      label: 'DAI',
      percentage: 25,
      val: <span>37863</span>,
    },
    {
      label: 'USDC',
      percentage: 75,
      val: <span>37863</span>,
    },
    {
      label: 'USDT',
      percentage: 55,
      val: <span>37863349</span>,
    },
  ],
  totalMode: true,
};

const totalRewards = {
  Campaign: 530400,
  Compensate: 530400,
};
export default class Mining extends Component {
  componentDidMount() {}

  state = {
    visible: false,
    isLogin: false,
    isUnlockType: false,
    claimModalVisible: false,
    lockReModalVisible: false,
    selectedTab: TabName.Liquidity,
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
  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    const { visible, isLogin, claimModalVisible, lockReModalVisible, isUnlockType, selectedTab } = this.state;

    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
            <h2>Mining</h2>
            <div className={styles.tabContainer}>
              <Tabs
                defaultActiveKey={selectedTab}
                className={[CustomTabKey, 'miningTabs'].join(' ')}
                onChange={this.callback}
              >
                <TabPane tab={<span className={styles.uppercase}>{TabName.Liquidity}</span>} key={TabName.Liquidity}>
                  <h3>{isLogin ? 'Your Liquidity Mining Reward' : 'Liquidity Mining Reward Today'}</h3>
                  <p className={styles.coins}>{numeral(mining.money).format('0,0')} DDS</p>
                  {isLogin ? null : (
                    <p className={styles.dynamic}>
                      <span>Current reward factor </span>
                      <br />
                      32 <span>DDS/Block</span>
                    </p>
                  )}

                  {isLogin ? (
                    <Button type="primary" className={styles.btn} onClick={this.showClaimModal}>
                      Claim
                    </Button>
                  ) : null}
                  {/* 
                  <ProgressBar data={barData} />
                  <p className={styles.fifo}>First come first served</p> */}
                </TabPane>
                <TabPane
                  tab={<span className={styles.uppercase}>{TabName.Utilization}</span>}
                  key={TabName.Utilization}
                >
                  <h3>{isLogin ? 'Your Liquidity Locked Rewards' : 'Liquidity Locked Rewards Today'}</h3>
                  <p className={styles.coins}>{numeral(utilization.money).format('0,0')} DDS</p>
                  {isLogin ? null : (
                    <p className={styles.dynamic}>
                      <span>Only reward for liquidity locked in private pool</span>
                    </p>
                  )}

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
                        className={[styles.btn, styles.cliamBtn].join(' ')}
                        onClick={this.showClaimModal}
                      >
                        Claim
                      </Button>
                      <div>
                        <Button type="link" onClick={this.showWithDraw} className={styles.recordLink}>
                          Rewards Balance Record
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </TabPane>
                <TabPane tab={<span className={styles.uppercase}>{TabName.Liquiditor}</span>} key={TabName.Liquiditor}>
                  <div className={styles.liquiditorWpr}>
                    <h3>{isLogin ? 'Your Liquiditor Mining Rewards' : 'Liquiditor Mining Rewards'}</h3>
                    <p>Win the liquiditor Campaign or get compensated when fund is empty</p>
                    <Row>
                      <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                        <span className={styles.ads}>{totalRewards.Campaign} DDS</span>
                        <span>Campaign Rewards</span>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                        <span className={styles.ads}>{totalRewards.Compensate} DDS</span>
                        <span>Compensate Rewards</span>
                      </Col>
                    </Row>
                    {isLogin ? null : (
                      <>
                        <p className={styles.wantoBe}>Want to become a liquiditor?</p>
                        <Button type="primary">Read Liquiditor Docs</Button>
                      </>
                    )}
                  </div>
                </TabPane>
              </Tabs>

              <ModalRender
                visible={claimModalVisible}
                onCancel={this.closeClaimModal}
                footer={null}
                height={320}
                title="Claim Rewards"
                className={commonStyles.commonModal}
              >
                <Row type="flex" justify="space-between" align="middle">
                  <Col xs={20} sm={20} md={20} lg={20}>
                    <Input placeholder="Amount you want to claim" />
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: 'center' }}>
                    <span>DDS</span>
                  </Col>
                </Row>
                <p className={currStyles.tips}>
                  Total Amount: 10.36 <Button type="link">Close All</Button>
                </p>
                <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button type="primary">Claim</Button>
                  </Col>
                </Row>
              </ModalRender>
              <ModalRender
                visible={lockReModalVisible}
                onCancel={this.closeLockModal}
                footer={null}
                height={390}
                title={isUnlockType ? 'Unlock reTokens' : 'Lock reTokens'}
                className={commonStyles.commonModal}
              >
                <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
                  <Col xs={24} sm={24} md={6} lg={6}>
                    <Select defaultValue="DAI" style={{ width: '100%', height: 50 }}>
                      {SupportedCoins.map((coin) => (
                        <Option value={coin}>{coin}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={24} md={18} lg={18}>
                    <span className={[commonStyles.maxWithdraw, isMobile ? commonStyles.mobile : ''].join(' ')}>
                      Max Amount: <span>3278392</span> DAI
                    </span>
                  </Col>
                  <Col span={24}>
                    <div className={[commonStyles.repay, isMobile ? commonStyles.mobile : ''].join(' ')}>
                      <Input placeholder={`Amount for ${isUnlockType ? 'unlocking' : 'locking'}`} />
                    </div>
                  </Col>
                </Row>
                {/* <Row >
              
            </Row> */}
                <Row gutter={[16, 16]} className={commonStyles.actionBtns} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button type="primary">Confirm</Button>
                  </Col>
                </Row>
              </ModalRender>
              <ModalRender
                visible={visible}
                title="Rewards Record"
                className={styles.modal}
                height={420}
                onCancel={this.closeWithDraw}
                footer={null}
              >
                <Table scroll={{ y: 300, x: 500 }} columns={columns} pagination={false} dataSource={data} />
              </ModalRender>
            </div>
            <div className={styles.bottomArea}>
              {selectedTab === TabName.Liquiditor ? (
                <SystemRanking isLogin={false}>
                  <CardInfo theme="inner" {...SystemFundBalance} />
                </SystemRanking>
              ) : null}
              {isLogin && selectedTab === TabName.Liquidity ? (
                <div className={styles.panels}>
                  <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <CardInfo theme="inner" {...ReTokenBalance}></CardInfo>

                      {/* <Pool {...ReTokenBalance} smallSize={true}> */}
                      {/* <Button type="primary" className={styles.lock} onClick={() => this.showLockModal(false)}>
                          Lock reTokens
                        </Button>
                        <p>Lock reTokens to start receving rewards inDDS tokens</p> 
                      </Pool>*/}
                    </Col>
                    {/* <Col xs={24} sm={24} md={8} lg={8}>
                      <Pool {...LockBalance} smallSize={true}>
                        <Button type="primary" className={styles.lock} onClick={() => this.showLockModal(true)}>
                          Unlock reTokens
                        </Button>
                        <p>Unlock reToken to be able to withdraw your reToken from the liquidity mining</p>
                      </Pool>
                    </Col> */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <PoolProgress {...MiningShare} />
                    </Col>
                  </Row>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
