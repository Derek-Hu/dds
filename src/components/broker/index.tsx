import { Component } from 'react';
import { Tabs, Row, Col, Input, Button } from 'antd';
import styles from './style.module.less';
import Step from './steps';
import { CustomTabKey } from '../../constant/index';
import BecomeSpark from './spark/become-spark';
import MyReferal from './referal/my-referal';
import { Visible } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import CampaignRewards from './referal/campaign-rewards';
import CampaignRewardsPool from './referal/campaign-rewards-pool';
import Commission from './referal/commission';

const { TabPane } = Tabs;

const tabName = {
  spark: 'spark',
  referal: 'referral',
};

const url = 'http://www.dds.com/home/78998d798';

export default class Broker extends Component<any, any> {
  state = {
    selectedTab: tabName.spark,
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <h2>Broker</h2>
        <div className={styles.referalInfo}>
          <Input value={url} disabled={true} className={styles.input} />
          <Button type="primary" className={styles.btn}>
            Copy referral link
          </Button>
          {/* <div className={styles.qrcode}>
                <Icon type="qrcode" style={{ fontSize: 32 }} />
              </div> */}
        </div>
        <Auth>
          <div className={styles.tabContainer}>
            <Tabs animated={false} activeKey={this.state.selectedTab} className={CustomTabKey} onChange={this.callback}>
              <TabPane tab={<span className={styles.uppercase}>spark program</span>} key={tabName.spark}>
                <BecomeSpark />
              </TabPane>
              <TabPane tab={<span className={styles.uppercase}>My referral</span>} key={tabName.referal}>
                <MyReferal />
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
        <Visible when={this.state.selectedTab === tabName.referal}>
          <Row gutter={20} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Commission />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <CampaignRewards />
            </Col>
          </Row>
          <Row style={{ marginTop: '24px' }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <CampaignRewardsPool />
            </Col>
          </Row>
        </Visible>
      </div>
    );
  }
}
