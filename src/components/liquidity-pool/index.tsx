import { Component } from 'react';
import { Tabs, Button, Row, Col, Select, Input, Alert, Descriptions } from 'antd';
import styles from './style.module.less';
import Balance from './liquidity-balance';
import { format, isNotZeroLike } from '../../util/math';
import commonStyles from '../funding-balance/modals/style.module.less';
import SharePool from './public/share-pool';
import AvailablePool from './private/available-pool';
import AvailablePoolUnlogin from './private/available-pool-unlogin';
import { CustomTabKey, CoinSelectOption } from '../../constant/index';
import ModalRender from '../modal-render/index';
import SiteContext from '../../layouts/SiteContext';
import LockedDetails, { ILockedData } from '../liquidity-pool/locked-details';
import LiquidityProvided from './public/liquidity-provided';
import LiquidityARP from './public/collaborative-arp';
import { Visible } from '../builtin/hidden';
import { doPrivateDeposit } from '../../services/pool.service';
import Auth, { Public } from '../builtin/auth';

const { TabPane } = Tabs;

const TabName = {
  Collaborative: 'Public',
  Private: 'Private',
};

const lockedData: ILockedData[] = [
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed',
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed',
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed',
  },
  {
    size: 3243,
    reward: 4322,
    fee: 100,
    locked: 4322,
    time: new Date().getTime(),
    status: 'Closed',
  },
];

export default class PoolArea extends Component<{ address?: string }, any> {
  state = {
    selectedTab: TabName.Collaborative,
    depositModalVisible: false,
    amount: '',
    selectedCoin: 'DAI',
  };
  componentDidMount() {}

  closeDepositModal = () => {
    this.setState({
      depositModalVisible: false,
    });
  };

  showDepositModal = () => {
    const { amount } = this.state;
    if (!isNotZeroLike(amount)) {
      return;
    }
    this.setState({
      depositModalVisible: true,
    });
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  onSelectChange = (selectedCoin: any) => {
    this.setState({
      selectedCoin,
    });
  };

  onAmountChange = (e: any) => {
    const val = e.target.value;
    this.setState({
      amount: val,
    });
  };

  confirmPrivateDeposit = async () => {
    this.closeDepositModal();
    const { amount, selectedCoin } = this.state;
    // @ts-ignore
    await doPrivateDeposit({ amount: parseFloat(amount), coin: selectedCoin });
  };
  render() {
    const { selectedTab, selectedCoin, amount } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
              <h2>LIQUIDITY POOL</h2>
              <div className={styles.tabContainer}>
                <Tabs className={CustomTabKey} defaultActiveKey={selectedTab} animated={false} onChange={this.callback}>
                  <TabPane
                    tab={<span className={styles.uppercase}>{TabName.Collaborative}</span>}
                    key={TabName.Collaborative}
                  >
                    <LiquidityARP />
                  </TabPane>
                  <TabPane tab={<span className={styles.uppercase}>{TabName.Private}</span>} key={TabName.Private}>
                    <Auth>
                      <Visible when={selectedTab === TabName.Private}>
                        <Alert
                          className={styles.poolMsg}
                          message="Note: private pool is targeting professional investor and market maker, please be aware of risk before you proceed."
                          type="warning"
                        />
                      </Visible>
                      <div className={[styles.actionArea, styles.privateArea].join(' ')}>
                        <Row gutter={[isMobile ? 0 : 12, isMobile ? 15 : 0]}>
                          <Col xs={24} sm={24} md={8} lg={6}>
                            <Select
                              defaultValue={selectedCoin}
                              style={{ width: '100%', height: 50 }}
                              className={styles.coinDropdown}
                              onChange={this.onSelectChange}
                            >
                              {CoinSelectOption}
                            </Select>
                          </Col>
                          <Col xs={24} sm={24} md={16} lg={18}>
                            <Input value={amount} onChange={this.onAmountChange} placeholder="Enter amount" />
                          </Col>
                        </Row>
                        <Button type="primary" className={styles.btn} onClick={this.showDepositModal}>
                          DEPOSIT
                        </Button>
                      </div>
                    </Auth>
                  </TabPane>
                </Tabs>
              </div>
              <div className={styles.panels}>
                <Visible when={selectedTab === TabName.Collaborative}>
                  <div>
                    <Auth>
                      <Row gutter={isMobile ? 0 : 12}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <SharePool />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                          <Balance isPrivate={false} />
                        </Col>
                      </Row>
                    </Auth>
                    {/* <Public>
                      <Row gutter={isMobile ? 0 : 12}>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <LiquidityProvided />
                        </Col>
                      </Row>
                    </Public> */}
                  </div>
                </Visible>
                <Visible when={selectedTab === TabName.Private}>
                  <div>
                    <Auth>
                      <div>
                        <Row gutter={isMobile ? 0 : 12}>
                          <Col xs={24} sm={24} md={12} lg={12}>
                            <AvailablePool />
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12}>
                            <Balance isPrivate={true} />
                          </Col>
                        </Row>
                        <LockedDetails data={lockedData} />
                      </div>
                    </Auth>
                    {/* <Public>
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <AvailablePoolUnlogin />
                        </Col>
                      </Row>
                    </Public> */}
                  </div>
                </Visible>
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
                  <Descriptions.Item label="Amount" span={24}>
                    {amount} {selectedCoin}
                  </Descriptions.Item>
                </Descriptions>
                <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button onClick={this.closeDepositModal}>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button onClick={this.confirmPrivateDeposit} type="primary">
                      Comfirm
                    </Button>
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
