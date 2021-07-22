import { Component } from 'react';
import { Row, Col } from 'antd';
import TradeBonus from '../components/trade-bonus/index';
import TradePool from '../components/trade-pool/index';
import styles from './style.module.less';
import KLine from '../components/k-line/index';
import FundingBalance from '../components/funding-balance/index';
import SiteContext from '../layouts/SiteContext';
import Auth from '../components/builtin/auth';
import { SupporttedUSD, SupporttedCoins, NetWork2Coin, DefaultKeNetwork } from '../constant/index';
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
    from: NetWork2Coin[DefaultKeNetwork],
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
    // const curPrice = await getCurPrice(coin);
    // console.log('dataFrom getCurPrice end', coin, curPrice);
    this.setState({
      // curPrice,
    });
  }

  updatePrice = (val: any) => {
    //console.log('dataFrom getCurPrice updatePrice', val);
    // const { coin } = this.state;
    // const currentNetwork = (this.context as ISiteContextProps) .currentNetwork;
    // const fromCoin = NetWork2Coin[currentNetwork];
    // if(fromCoin === preFrome && preTo === coin){
    this.setState({
      curPrice: val,
    });
    // }
  };

  render() {
    const { curPrice, coin, from } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile, currentNetwork, timestamp }) => {
          const fromCoin = NetWork2Coin[currentNetwork] || from;
          //console.log('trade currentNetwork', currentNetwork, fromCoin);
          return (
            <div className={[styles.tradeInfoPool, isMobile ? styles.mobile : ''].join(' ')}>
              <Row className={styles.chartBalance}>
                <Col xs={24} sm={24} md={12} lg={16} className={styles.charWpr}>
                  <KLine updatePrice={this.updatePrice} curPrice={curPrice} from={fromCoin} to={coin} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                  <FundingBalance />
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
