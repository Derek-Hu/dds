import { Component } from 'react';
import { Row, Col } from 'antd';
import TradeBonus from '../components/trade-bonus/index';
import TradeInfo from '../components/card-info/index';
import TradePool from '../components/trade-pool/index';
import styles from './style.module.less';
import KLine from '../components/k-line/index';
import FundingBalance from '../components/funding-balance/index';
import SiteContext from '../layouts/SiteContext';
import { getFundingBalanceInfo, getTradeOrders, getTradeInfo, getPriceGraphData } from '../services/trade.service';

const from = 'ETH';

interface IState {
  coin: IUSDCoins
  graphData?: IPriceGraph;
  tradeInfos?: ITradeInfo[]
  duration: IGraphDuration;
}
export default class TradePage extends Component {
  state:IState = {
    coin: 'DAI',
    duration: 'day',
  }
  
  async componentDidMount() {
    const { coin, duration } = this.state;
    const tradeInfos = await getTradeInfo(coin);
    const graphData = await getPriceGraphData({ from, to: coin}, duration);
    this.setState({
      tradeInfos,
      graphData
    });
  }

  render() {
    const { coin, graphData, tradeInfos } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          const { address } = account || {};

          return (
            <div className={[styles.tradeInfoPool, isMobile ? styles.mobile : ''].join(' ')}>
              <Row className={styles.chartBalance} gutter={isMobile ? 0 : 24}>
                <Col xs={24} sm={24} md={12} lg={16} className={styles.charWpr}>
                  <KLine />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <FundingBalance coins={{from, to: coin }} graphData={graphData}/>
                </Col>
              </Row>
              
              <div>
                {address ? <TradeBonus coin={coin} graphData={graphData} /> : null}
                <div>
                  <Row gutter={isMobile ? 0 : 20}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <TradePool coin={coin} />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      { tradeInfos ? <TradeInfo items={tradeInfos} theme="outer" title="Info"/> : null }
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
