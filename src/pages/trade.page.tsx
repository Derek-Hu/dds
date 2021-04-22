import { Component } from 'react';
import { Row, Col } from 'antd';
import TradeBonus from '../components/trade-bonus/index';
import TradePool from '../components/trade-pool/index';
import styles from './style.module.less';
import KLine from '../components/k-line/index';
import FundingBalance from '../components/funding-balance/index';
import SiteContext, { ISiteContextProps } from '../layouts/SiteContext';
import { getCurPrice } from '../services/trade.service';
import Auth from '../components/builtin/auth';
import { SupporttedUSD, SupporttedCoins, NetWork2Coin } from '../constant/index';
import TradeInfo from '../components/trade-info/index';
import parse from '../util/url';

interface IState {
  from: IFromCoins;
  coin: IUSDCoins;
  tradeInfos?: ITradeInfo[];
  curPrice?: number;
}
export default class TradePage extends Component {
  state: IState = {
    from: 'ETH',
    coin: 'DAI',
  };

  static contextType = SiteContext;

  async componentDidMount() {
    // @ts-ignore
    const { from, to } = parse();
    // @ts-ignore
    const isValid = from && to && SupporttedCoins[from] && SupporttedUSD[to];
    if (isValid) {
      this.setState({
        from,
        coin: to,
      });
    }

    const coin = isValid ? to : this.state.coin;
    const curPrice = await getCurPrice(coin);
    this.setState({
      curPrice,
    });
  }

  render() {
    const { curPrice, coin, from } = this.state;
    const network = (this.context as ISiteContextProps).currentNetwork;
    const fromCoin = NetWork2Coin[network] || from;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => {
          return (
            <div className={[styles.tradeInfoPool, isMobile ? styles.mobile : ''].join(' ')}>
              <Row className={styles.chartBalance}>
                <Col xs={24} sm={24} md={12} lg={16} className={styles.charWpr}>
                  <KLine from={fromCoin} to={coin} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <FundingBalance coins={{ from: fromCoin, to: coin }} />
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
                      <TradeInfo from={fromCoin} coin={coin} />
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
