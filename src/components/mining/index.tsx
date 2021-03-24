import { Component } from 'react';
import { Tabs, Button, Input, Row, Col, Select, Table } from 'antd';
import styles from './style.module.less';
import commonStyles from '../funding-balance/modals/style.module.less';
import dayjs from 'dayjs';
import { isNumberLike, isNotZeroLike, format } from '../../util/math';
import { CustomTabKey, SupportedCoins } from '../../constant/index';
import Pool, { IPool } from '../liquidity-pool/pool';
import ColumnConvert from '../column-convert/index';
import ModalRender from '../modal-render/index';
import currStyles from '../trade-bonus/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import Liquidity from './liquidity/your-liquidity-mining-reward';
import LiquidityLocked from './liquidity-locked/your-liquidity-locked-reward';
import Liquiditor from './liquiditor/your-liquiditor-mining-reward';
import { Visible } from 'components/builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import ReTokenBalance from './liquidity/re-token-balance';
import SystemFundBalance from './liquiditor/system-fund-balance';
import YourMiningShare from './liquidity/your-mining-share';
import { formatTime } from '../../util/time';

const { Option } = Select;
const { TabPane } = Tabs;

const TabName = {
  Liquidity: 'liquidity',
  Utilization: 'active liquidity',
  Liquiditor: 'liquiditor',
};

interface IReward {
  time: number;
  pair: {
    from: string;
    to: string;
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
    price: 'Open Price',
    reward: 'Reward(SLD)',
  },
  render(value, key, record) {
    switch (key) {
      case 'time':
        return formatTime(value);
      case 'pair':
        const { from, to } = record[key];
        return from + '/' + to;
      case 'amount':
      case 'price':
      case 'reward':
        return format(value);
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
export default class Mining extends Component {
  state = {
    visible: false,
    isLogin: true,
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
                animated={false}
                className={[CustomTabKey, 'miningTabs'].join(' ')}
                onChange={this.callback}
              >
                <TabPane tab={<span className={styles.uppercase}>{TabName.Liquidity}</span>} key={TabName.Liquidity}>
                  <Liquidity />
                </TabPane>
                <TabPane
                  tab={<span className={styles.uppercase}>{TabName.Utilization}</span>}
                  key={TabName.Utilization}
                >
                  <LiquidityLocked />
                </TabPane>
                <TabPane tab={<span className={styles.uppercase}>{TabName.Liquiditor}</span>} key={TabName.Liquiditor}>
                  <Liquiditor />
                </TabPane>
              </Tabs>

              {/* <ModalRender
                visible={claimModalVisible}
                onCancel={this.closeClaimModal}
                footer={null}
                height={320}
                title="Claim SLD"
                className={commonStyles.commonModal}
              >
                <Row type="flex" justify="space-between" align="middle">
                  <Col xs={20} sm={20} md={20} lg={20}>
                    <Input placeholder="Amount you want to claim" />
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: 'center' }}>
                    <span>SLD</span>
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
              </ModalRender> */}
              {/* <ModalRender
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
                <Row gutter={[16, 16]} className={commonStyles.actionBtns} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button type="primary">Confirm</Button>
                  </Col>
                </Row>
              </ModalRender> */}
              {/* <ModalRender
                visible={visible}
                title="Rewards Record"
                className={styles.modal}
                height={420}
                onCancel={this.closeWithDraw}
                footer={null}
              >
                <Table scroll={{ y: 300, x: 500 }} columns={columns} pagination={false} dataSource={data} />
              </ModalRender> */}
            </div>
            <div className={styles.bottomArea}>
              <Visible when={selectedTab === TabName.Liquidity}>
                <Auth>
                  <div className={styles.panels}>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <YourMiningShare />
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <ReTokenBalance />
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
                        <p>Unlock reToken to be able to withdraw your reToken from the liquidity</p>
                      </Pool>
                    </Col> */}
                    </Row>
                  </div>
                </Auth>
              </Visible>
              {/* <Visible when={selectedTab === TabName.Liquiditor}>
                <SystemFundBalance />
              </Visible> */}
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
