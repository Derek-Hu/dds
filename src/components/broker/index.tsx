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
import BecomeSpark, { ISpark } from './become-spark';
import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';
import CardInfo from "../card-info/index";

// const LockBalance: IPool = {
//   title: 'Commission',
//   coins: [
//     {
//       name: 'DAI',
//       value: 647,
//     },
//     {
//       name: 'USDC',
//       value: 638,
//     },
//     {
//       name: 'USDT',
//       value: 7378,
//     },
//   ],
// };

const LockBalance = {
  title: 'Commission',
  // desc: <span>Total Liquidity: <span style={style}>23534.33</span> USD</span>,
  items: [{
      label: 'DAI',
      val: <span>647</span>
  },{
      label: 'USDC',
      val: <span>638</span>
  },{
      label: 'USDT',
      val: <span>7378</span>
  }],
}

const { TabPane } = Tabs;



const CampaignRewards = {
  title: 'Campaign Rewards',
  items: [
    {
      label: 'DAI',
      value: 647,
    },
    {
      label: 'USDC',
      value: 638,
    },
    {
      label: 'USDT',
      value: 7378,
    },
  ],
};

const tabName = {
  spark: 'spark',
  referal: 'referral',
};
const adsData: ISpark = {
  percentage: 40,
  contry: '20+',
  sparks: 124,
  referals: 9824,
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
    commissionVisible: false,
    campaignVisible: false,
    isLogin: true,
  };
  componentDidMount() {}

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
    const { isLogin, campaignVisible, commissionVisible } = this.state;
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
            {
              isLogin ? <div className={styles.tabContainer}>
              <Tabs animated={false} activeKey={this.state.selectedTab} className={CustomTabKey} onChange={this.callback}>
                <TabPane tab={<span className={styles.uppercase}>spark program</span>} key={tabName.spark}>
                    <BecomeSpark {...adsData}/>
                </TabPane>
                <TabPane tab={<span className={styles.uppercase}>My referral</span>} key={tabName.referal}>
                  <h3>Summary</h3>
                  <Row className="padding-bottom-60">
                    <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
                      <span className={styles.ads}>{'A'}</span>
                      <span>Current Level</span>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
                      <span className={styles.ads}>{referalInfo.referrals}</span>
                      <span>Ranking</span>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
                      <span className={styles.ads}>{referalInfo.referrals}</span>
                      <span>Referrals</span>
                    </Col>
                  </Row>
                  <div style={{marginTop: '48px', paddingBottom: '40px'}}>
                      <span className={styles.ads}>{referalInfo.bonus}</span>
                      <span>Bonus(USD)</span>
                      <div>
                        <Button style={{width: '120px', margin: '20px'}} type="primary">Claim</Button>
                      </div>
                  </div>
                </TabPane>
              </Tabs>
            </div> : <div className={styles.becomeContainer}><BecomeSpark {...adsData}/></div>
            }
            {this.state.selectedTab === tabName.spark ? (
              <Step />
            ) : (
              <>
                <Row gutter={20} style={{ marginTop: '20px' }}>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <CardInfo theme="inner" {...LockBalance}>
                      <Button type="link" onClick={this.showCommissionModal}>
                        Commission Record
                      </Button>
                    </CardInfo>
                    {/* <Pool {...LockBalance}>
                      <Button type="link" onClick={this.showCommissionModal}>Commission Record</Button>
                    </Pool> */}
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <CampionPool />
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <CardInfo theme="inner" {...LockBalance}>
                      <Button type="link" onClick={this.showCampaignModal}>Rewards Record</Button>
                    </CardInfo>
                    {/* <Pool {...CampaignRewards}>
                      
                    </Pool> */}
                  </Col>
                </Row>
                {/* <ReferalDetails data={data} /> */}
              </>
            )}
            <ModalRender
              visible={commissionVisible}
              title="Commission Record"
              className={styles.modal}
              height={420}
              onCancel={this.closeCommissionModal}
              footer={null}
            >
              <Table
                scroll={{ y: 300, x: 500 }}
                columns={CommissionColumns}
                pagination={false}
                dataSource={commissionData}
              />
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
