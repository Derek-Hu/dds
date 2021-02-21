import { Component } from 'react';
import { Icon, Tabs, Row, Col, Input, Button, Table } from 'antd';
import styles from './style.module.less';
import numeral from 'numeral';
import Step from './steps';
import dayjs from 'dayjs';
import ReferalDetails, { IData } from './referal-details';
import { CustomTabKey } from '../../constant/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import Pool, { IPool } from '../liquidity-pool/pool';
import CampionPool from './campion-pool';
import ColumnConvert from '../column-convert/index';

const { TabPane } = Tabs;

const LockBalance: IPool = {
  title: 'Commission',
  coins: [
    {
      name: 'DAI',
      value: 647,
    },
    {
      name: 'USDC',
      value: 638,
    },
    {
      name: 'USDT',
      value: 7378,
    },
  ],
};

const CampaignRewards: IPool = {
  title: 'Campaign Rewards',
  coins: [
    {
      name: 'DAI',
      value: 647,
    },
    {
      name: 'USDC',
      value: 638,
    },
    {
      name: 'USDT',
      value: 7378,
    },
  ],
};

const tabName = {
  spark: 'spark',
  referal: 'referral',
};
const adsData = {
  contry: '20+',
  sparks: 124,
  invitations: 9824,
  bonus: 98247489,
};

const url = 'http://www.dds.com/home/78998d798';

const referalInfo = {
  referrals: 9824,
  bonus: 98247489,
};

const data: IData[] = [
  {
    bonus: 3243,
    fee: 100,
    address: '0xfs328xkdfwr23rew9328320',
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 10320,
    address: '0xfs328xkdfwr23rew9328320',
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 100,
    address: '0xfs328xkdfwr23rew9328320',
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 100,
    address: '0xfs328xkdfwr23rew9328320',
    time: new Date().getTime(),
  },
];


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
const CommissionColumns = ColumnConvert<ICommission, {}>({
  column: {
    time: 'Time',
    pair: 'Friend Address',
    amount: 'Amount',
    price: 'Settlements Fee',
    reward: 'Commission',
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

const commissionData: ICommission[] = [
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
export default class Broker extends Component {
  state = {
    selectedTab: tabName.spark,
    generateModalVisible: false,
    commissionVisible: false,
    campaignVisible: false,
  };
  componentDidMount() {}

  showGenerateModal = () => {
    this.setState({
      generateModalVisible: true,
    });
  };
  closeGenerateModal = () => {
    this.setState({
      generateModalVisible: false,
    });
  };

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

  render() {
    const { generateModalVisible , campaignVisible, commissionVisible } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
            <h2>Broker</h2>
            <div className={styles.referalInfo}>
              <Input value={url} disabled={true} className={styles.input} />
              <Button type="primary" className={styles.btn} onClick={this.showGenerateModal}>
                Copy referral link
              </Button>
              {/* <div className={styles.qrcode}>
                <Icon type="qrcode" style={{ fontSize: 32 }} />
              </div> */}
            </div>
            <div className={styles.tabContainer}>
              <Tabs activeKey={this.state.selectedTab} className={CustomTabKey} onChange={this.callback}>
                <TabPane tab={<span className={styles.uppercase}>spark program</span>} key={tabName.spark}>
                  <h3>Become DDerivatives's Spark</h3>
                  <p className={styles.descOne}>
                    Spread DeFi Spark To The Old World Make Your Influence Into Affluence
                  </p>
                  <div className={styles.percentage}>40%</div>
                  <p className={styles.descTwo}>Settlements Fee Commission</p>
                  <Row className={styles.tabSpark}>
                    <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{adsData.contry}</span>
                      <span>Countries</span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{adsData.sparks}</span>
                      <span>Sparks</span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{adsData.invitations}</span>
                      <span>Referals</span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <span className={styles.ads}>{numeral(adsData.bonus).format('0,0')}</span>
                      <span>Bonus(USD)</span>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab={<span className={styles.uppercase}>My referral</span>} key={tabName.referal}>
                  <h3 className={styles.referalTitle}>Summary</h3>
                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{'A'}</span>
                      <span>Current Level</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{referalInfo.referrals}</span>
                      <span>Ranking</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{referalInfo.referrals}</span>
                      <span>Referrals</span>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
                      <span className={styles.ads}>{referalInfo.bonus}</span>
                      <span>Bonus(DDS)</span>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            {this.state.selectedTab === tabName.spark ? (
              <Step />
            ) : (
              <>
                <Row gutter={20} style={{ marginTop: '20px' }}>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Pool {...LockBalance}>
                      <Button type="link" onClick={this.showCommissionModal}>Commission Record</Button>
                    </Pool>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <CampionPool />
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Pool {...CampaignRewards}>
                      <Button type="link" onClick={this.showCampaignModal}>Rewards Record</Button>
                    </Pool>
                  </Col>
                </Row>
                <ReferalDetails data={data} />
              </>
            )}
            <ModalRender
              width={500}
              visible={generateModalVisible}
              onCancel={this.closeGenerateModal}
              closable={false}
              footer={null}
              height={300}
              title="Generate your referral link"
              className={commonStyles.commonModal}
            >
              <p style={{ textAlign: 'center' }}>
                To become a spark broker, you need to sign in our Decentralized broker system in order to generate your
                referral link, it may cost a little gas.
              </p>
              <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button>Cancel</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button type="primary">Generate</Button>
                </Col>
              </Row>
            </ModalRender>
            <ModalRender
              visible={commissionVisible}
              title="Commission Record"
              className={styles.modal}
              height={420}
              onCancel={this.closeCommissionModal}
              footer={null}
            >
              <Table scroll={{ y: 300, x: 500 }} columns={CommissionColumns} pagination={false} dataSource={commissionData} />
            </ModalRender>
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
