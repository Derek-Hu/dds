import { Component } from 'react';
import ProgressBar from '../progress-bar/index';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { getTradeLiquidityPoolInfo } from '../../services/trade.service';
import { dividedPecent } from '../../util/math';
interface IState {
  poolInfo?: ITradePoolInfo;
  loading: boolean;
}
export default class TradePool extends Component<{ coin: IUSDCoins }, IState> {
  state: IState = {
    loading: false,
  };

  async componentDidMount() {
    const { coin } = this.props;
    this.setState({
      loading: true,
    });
    try {
      const poolInfo = await getTradeLiquidityPoolInfo(coin);
      this.setState({
        poolInfo,
      });
    } catch {}
    this.setState({
      loading: false,
    });
  }

  render() {
    const { coin } = this.props;
    const { poolInfo, loading } = this.state;

    const publicBar = {
      title: 'Public Pool',
      desc: 'Available Liquidity',
      value: (
        <span>
          {poolInfo?.public?.value}/ {poolInfo?.public?.total}
        </span>
      ),
      percentage: dividedPecent(poolInfo?.public?.value, poolInfo?.public?.total),
      unit: coin,
    };

    const privateBar = {
      title: 'Private Pool',
      desc: 'Available Liquidity',
      value: (
        <span>
          {poolInfo?.private?.value}/ {poolInfo?.private?.total}
        </span>
      ),
      percentage: dividedPecent(poolInfo?.private?.value, poolInfo?.private?.total),
      unit: coin,
    };

    return (
      <SiteContext.Consumer>
        {() => {
          return (
            <div className={styles.root}>
              <h2>Liquidity Pool</h2>
              <div className={styles.barContainer}>
                <ProgressBar {...publicBar} loading={loading} />
                <div style={{ padding: '40px' }}></div>
                <ProgressBar {...privateBar} loading={loading} />
              </div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
