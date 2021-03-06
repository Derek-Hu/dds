import { Component } from 'react';
import { Tabs, Row, Col, Input, Button, message } from 'antd';
import styles from './style.module.less';
import Step from './steps';
import { CustomTabKey, ddsBasePath } from '../../constant/index';
import BecomeSpark from './spark/become-spark';
import MyReferal from './referal/my-referal';
import { Visible } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import CampaignRewards from './referal/campaign-rewards';
import CampaignRewardsPool from './referal/campaign-rewards-pool';
import Commission from './referal/commission';
import SiteContext from '../../layouts/SiteContext';
import { account2ReferalCode } from '../../services/broker.service';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatMessage } from 'locale/i18n';

const { TabPane } = Tabs;

const tabName = {
  spark: 'spark',
  referal: 'referral',
};

export default class Broker extends Component<any, any> {
  static contextType = SiteContext;

  state = {
    selectedTab: tabName.spark,
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  onCopy = () => {
    message.success(formatMessage({ id: 'copied' }));
    this.setState({ copied: true });
  };

  render() {
    const referalCode = account2ReferalCode(this.context.address);
    const url = referalCode ? `${ddsBasePath}/referal?code=${referalCode}` : '';
    return (
      <SiteContext.Consumer>
        {({ isBSC }) => (
          <div className={styles.root}>
            <h2>Broker</h2>
            <Auth>
              <div className={styles.referalInfo}>
                <Input value={url} disabled={true} className={styles.input} />
                {referalCode ? (
                  <CopyToClipboard text={url} onCopy={this.onCopy}>
                    <Button type="primary" className={styles.btn}>
                      Copy referral link
                    </Button>
                  </CopyToClipboard>
                ) : (
                  <Button type="primary" className={styles.btn}>
                    Copy referral link
                  </Button>
                )}
                {/* <div className={styles.qrcode}>
                  <Icon type="qrcode" style={{ fontSize: 32 }} />
                </div> */}
              </div>
              <div className={styles.tabContainer}>
                <Tabs
                  animated={false}
                  activeKey={this.state.selectedTab}
                  className={CustomTabKey}
                  onChange={this.callback}
                >
                  <TabPane tab={<span className={styles.uppercase}>spark program</span>} key={tabName.spark}>
                    <BecomeSpark />
                  </TabPane>
                  <TabPane tab={<span className={styles.uppercase}>My referral</span>} key={tabName.referal}>
                    <MyReferal />
                    <Row style={{ paddingBottom: '100px' }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Commission />
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </Auth>
            <Public>
              <BecomeSpark />
            </Public>
            <Visible when={this.state.selectedTab === tabName.spark}>
              <Step />
            </Visible>
            <Visible when={isBSC && this.state.selectedTab === tabName.referal}>
              <Row gutter={20} style={{ marginTop: '20px' }}>
                {/* <Col xs={24} sm={24} md={24} lg={24}>
              <Commission />
            </Col> */}
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CampaignRewards />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CampaignRewardsPool />
                </Col>
              </Row>
            </Visible>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
