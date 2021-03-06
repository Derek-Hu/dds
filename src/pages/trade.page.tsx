import { Component } from 'react';
import { Row, Col } from 'antd';
import TradeBonus, { IRecord } from '../components/trade-bonus/index';
import TradeInfo from '../components/card-info/index';
import TradePool from '../components/trade-pool/index';
import styles from './style.module.less';
import KLine from '../components/k-line/index';
import FundingBalance from '../components/funding-balance/index';
import SiteContext from '../layouts/SiteContext';

const data: IRecord[] = [
  {
    id: '001',
    time: new Date().getTime(),
    type: 'Buy',
    price: 400.65,
    amount: 10.36,
    costCoin: 'DAI',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: 'CLOSED',
    exercise: '-',
  },
  {
    id: '002',
    time: new Date().getTime(),
    type: 'Buy',
    price: 400.65,
    amount: 10.36,
    costCoin: 'USDT',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: -0.25,
    },
    status: 'ACTIVE',
    exercise: '-',
  },
  {
    id: '003',
    time: new Date().getTime(),
    type: 'Short',
    price: 400.65,
    amount: 10.36,
    costCoin: 'USDC',
    cost: 5.23,
    fee: 0.1,
    pl: {
      val: 10.56,
      percentage: 0.25,
    },
    status: 'CLOSED',
    exercise: '-',
  },
];

const infos = {
  'Ticker Root': 20,
  'Expiry Date': 'Funding Rate',
  'Settlements Fee Rate': 'Funding Rate',
  'Forced Liquidation Rate': 'Funding Rate',
  Type: 'Funding Rate',
  Exercise: 'Funding Rate',
  'Funding Rate': 'Funding Rate',
};
// @ts-ignore
const infoItems = Object.keys(infos).map((key) => ({ label: key, value: infos[key] }));
export default class TradePage extends Component {
  componentDidMount() {
    console.log('mount');
  }

  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          const { coins, address } = account || {};
          const usdt = coins?.USDC;

          return (
            <div className={[styles.tradeInfoPool, isMobile ? styles.mobile : ''].join(' ')}>
              <Row className={styles.chartBalance} gutter={isMobile ? 0 : 24}>
                <Col xs={24} sm={24} md={12} lg={16} className={styles.charWpr}>
                  <KLine />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <FundingBalance />
                </Col>
              </Row>
              {address ? <TradeBonus data={data} /> : null}
              <div>
                {/* <Row gutter={isMobile? 0: 20}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <TradePool />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <TradeInfo theme="outer" title="Info" items={infoItems}/>
                </Col>
              </Row> */}
                <TradeBonus data={data} />
                <div>
                  <Row gutter={isMobile ? 0 : 20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <TradePool />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <TradeInfo theme="outer" title="Info" items={infoItems} />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
