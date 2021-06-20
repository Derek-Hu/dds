import { Component } from 'react';
import { Tabs, Row, Col } from 'antd';
import styles from './style.module.less';
import Balance from './liquidity-balance';
import SharePool from './public/share-pool';
import AvailablePool from './private/available-pool';
// import AvailablePoolUnlogin from './private/available-pool-unlogin';
import { CustomTabKey } from '../../constant/index';
import SiteContext from '../../layouts/SiteContext';
import LockedDetails from '../liquidity-pool/locked-details';
// import LiquidityProvided from './public/liquidity-provided';
import LiquidityARP from './public/collaborative-arp';
import { Visible } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import PrivateDeposit from './private/private-deposit';
import { formatMessage } from '~/util/i18n';

const { TabPane } = Tabs;

const TabName = {
  Collaborative: 'Public',
  Private: 'Private',
};

export default class PoolArea extends Component<any, any> {
  state = {
    selectedTab: TabName.Collaborative,
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    const { selectedTab } = this.state;
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
                    <PrivateDeposit />
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
                        <LockedDetails />
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
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
