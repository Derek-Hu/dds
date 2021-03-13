import { Component } from 'react';
import { Icon, Tabs, Row, Col, Input, Button, Table } from 'antd';
import styles from './style.module.less';
import numeral from 'numeral';
import Step from './steps';
import dayjs from 'dayjs';
import { CustomTabKey } from '../../constant/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import Pool, { IPool } from '../liquidity-pool/pool';
import CampionPool from './campion-pool';
import ColumnConvert from '../column-convert/index';
import BecomeSpark, { ISpark } from './spark/become-spark';
import MyReferal from './referal/my-referal';
import CardInfo from '../card-info/index';
import { Visible, Hidden } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import { getSparkData, getMyReferalInfo } from '../../services/broker.service';
import CampaignRewards from './referal/campaign-rewards';
import CampaignRewardsPool from './referal/campaign-rewards-pool';
import Commission from './referal/commission';

const { TabPane } = Tabs;

const tabName = {
  spark: 'spark',
  referal: 'referral',
};

const url = 'http://www.dds.com/home/78998d798';

interface ICommission {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
  reward: number;
}

interface ICampion {
  time: number;
  pair: {
    from: 'ETH';
    to: 'DAI';
  };
  price: number;
  amount: number;
}

const CampionColumns = ColumnConvert<ICampion, {}>({
  column: {
    time: 'Time',
    pair: 'DAI',
    amount: 'USDC',
    price: 'USDT',
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
      default:
        return value;
    }
  },
});

const campionData: ICampion[] = [
  {
    time: new Date().getTime(),
    pair: {
      from: 'ETH',
      to: 'DAI',
    },
    price: 32432,
    amount: 32,
  },
];
interface IState {
  data?: IBrokerSpark;
  loading: boolean;
  selectedTab: string;
  commissionVisible: boolean;
  campaignVisible: boolean;
  referalInfo?: IBrokerReferal;
}

export default class Broker extends Component<any, IState> {
  state: IState = {
    selectedTab: tabName.spark,
    commissionVisible: false,
    campaignVisible: false,
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getSparkData();
    this.setState({
      data,
    });

    const referalInfo = await getMyReferalInfo();
    this.setState({
      referalInfo,
    });

    this.setState({ loading: false });
  }

  showCommissionModal = () => {
    this.setState({
      commissionVisible: true,
    });
  };
  closeCommissionModal = () => {
    this.setState({
      commissionVisible: false,
    });
  };

  showCampaignModal = () => {
    this.setState({
      campaignVisible: true,
    });
  };
  closeCampaignModal = () => {
    this.setState({
      campaignVisible: false,
    });
  };

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  onClaim = () => {

  }

  render() {
    const { campaignVisible, commissionVisible, data, loading, referalInfo } = this.state;
    const adsData: ISpark = {
      percentage: data?.commission,
      contry: '20+',
      sparks: 124,
      referals: data?.referals,
      bonus: data?.bonus,
    };
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
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
                <Tabs
                  animated={false}
                  activeKey={this.state.selectedTab}
                  className={CustomTabKey}
                  onChange={this.callback}
                >
                  <TabPane tab={<span className={styles.uppercase}>spark program</span>} key={tabName.spark}>
                    <Hidden when={loading || !data}>
                      <BecomeSpark {...adsData} />
                    </Hidden>
                  </TabPane>
                  <TabPane tab={<span className={styles.uppercase}>My referral</span>} key={tabName.referal}>
                      <MyReferal data={referalInfo} onClaim={this.onClaim}/>
                  </TabPane>
                </Tabs>
              </div>
            </Auth>
            <Public>
              <div className={styles.becomeContainer}>
                <BecomeSpark {...adsData} />
              </div>
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
              <Row style={{marginTop: '24px'}}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <CampaignRewardsPool />
                </Col>
              </Row>
            </Visible>
            <ModalRender
              visible={campaignVisible}
              title="Campaign Rewards Record"
              className={styles.modal}
              height={420}
              onCancel={this.closeCampaignModal}
              footer={null}
            >
              <Table scroll={{ y: 300, x: 500 }} columns={CampionColumns} pagination={false} dataSource={campionData} />
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
