import { Component } from 'react';
import ProgressBar from '../progress-bar/index';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { getTradeLiquidityPoolInfo } from '../../services/trade.service';
import { dividedPecent } from '../../util/math';
import Placeholder from '../placeholder/index';
interface IState {
  poolInfo?: ITradePoolInfo;
}
export default class TradePool extends Component<{ coin: IUSDCoins }, IState> {
  state: IState = {};

  async componentDidMount() {
    const { coin } = this.props;
    try{
      const poolInfo = await getTradeLiquidityPoolInfo(coin);
      this.setState({
        poolInfo,
      });
    }catch{}
  }

  render() {
    const { coin } = this.props;
    const { poolInfo } = this.state;

    const publicBar = poolInfo
      ? {
          title: 'Public Pool',
          desc: 'Available Liquidity',
          value: (
            <span>
              {poolInfo.public?.value}/ {poolInfo.public?.total}
            </span>
          ),
          percentage: dividedPecent(poolInfo.public?.value, poolInfo.public?.total),
          unit: coin,
        }
      : null;

    const privateBar = poolInfo
      ? {
          title: 'Private Pool',
          desc: 'Available Liquidity',
          value: (
            <span>
              {poolInfo.private?.value}/ {poolInfo.private?.total}
            </span>
          ),
          percentage: dividedPecent(poolInfo.private?.value, poolInfo.private?.total),
          unit: coin,
        }
      : null;

    return (
      <SiteContext.Consumer>
        {() => {
          return <div className={styles.root}>
              <h2>Liquidity Pool</h2>
              <Placeholder />
              <div className={styles.barContainer}>
                {publicBar ? <ProgressBar {...publicBar} /> : null}
                <div style={{ padding: '40px' }}></div>
                {privateBar ? <ProgressBar {...privateBar} /> : null}
              </div>
            </div>
        }}
      </SiteContext.Consumer>
    );
  }
}
