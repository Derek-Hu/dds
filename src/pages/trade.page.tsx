import { Component } from 'react';
import { Row, Col } from 'antd';
import TradeBonus from '../components/trade-bonus/index';
import TradeInfo from '../components/card-info/index';
import TradePool from '../components/trade-pool/index';
import styles from './style.module.less';
import KLine from '../components/k-line/index';
import FundingBalance from '../components/funding-balance/index';
import SiteContext from '../layouts/SiteContext';
import { getFundingBalanceInfo, getCurPrice, getTradeOrders, getTradeInfo, getPriceGraphData } from '../services/trade.service';
import Auth from '../components/builtin/auth';
const from = 'ETH';

interface IState {
  coin: IUSDCoins;
  graphData?: IPriceGraph;
  tradeInfos?: ITradeInfo[];
  duration: IGraphDuration;
  curPrice?: number;
}
export default class TradePage extends Component {
  state: IState = {
    coin: 'DAI',
    duration: 'day',
  };

  async componentDidMount() {
    const { coin, duration } = this.state;
    const curPrice = await getCurPrice(coin);
    const tradeInfos = await getTradeInfo(coin);
    const graphData = await getPriceGraphData({ from, to: coin }, duration);
    this.setState({
      tradeInfos,
      graphData,
      curPrice,
    });
  }

  render() {
    const { coin, graphData, tradeInfos, curPrice } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          return (
            <div className={[styles.tradeInfoPool, isMobile ? styles.mobile : ''].join(' ')}>
              <Row className={styles.chartBalance} gutter={isMobile ? 0 : 24}>
                <Col xs={24} sm={24} md={12} lg={16} className={styles.charWpr}>
                  {/* <KLine /> */}
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <FundingBalance curPrice={curPrice} coins={{ from, to: coin }} />
                </Col>
              </Row>
              <div>
                <Auth>
                  <TradeBonus coin={coin} curPrice={curPrice} />
                </Auth>
                <div>
                  <Row gutter={isMobile ? 0 : 20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <TradePool coin={coin} />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      {tradeInfos ? <TradeInfo items={tradeInfos} theme="outer" title="Info" /> : null}
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
