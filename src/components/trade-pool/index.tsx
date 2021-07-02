import { Component } from 'react';
import ProgressBar from '../progress-bar/index';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { getTradeLiquidityPoolInfo } from '../../services/trade.service';
import { dividedPecent, format, formatInt } from '../../util/math';
import { formatMessage } from 'locale/i18n';

interface IState {
  poolInfo?: ITradePoolInfo;
  loading: boolean;
}

export default class TradePool extends Component<{ coin: IUSDCoins }, IState> {
  state: IState = {
    loading: true,
  };

  UNSAFE_componentWillReceiveProps() {
    this.loadData();
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { coin } = this.props;

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
      title: formatMessage({ id: 'public-pool' }),
      desc: formatMessage({ id: 'available-liquidity' }),
      value: (
        <span>
          {format(poolInfo?.public?.value)}/ {formatInt(poolInfo?.public?.total)}
        </span>
      ),
      percentage: Math.floor(dividedPecent(poolInfo?.public?.value, poolInfo?.public?.total)),
      unit: coin,
    };

    const privateBar = {
      title: formatMessage({ id: 'private-pool' }),
      desc: formatMessage({ id: 'available-liquidity' }),
      value: (
        <span>
          {format(poolInfo?.private?.value)}/ {formatInt(poolInfo?.private?.total)}
        </span>
      ),
      percentage: Math.floor(dividedPecent(poolInfo?.private?.value, poolInfo?.private?.total)),
      unit: coin,
    };

    return (
      <SiteContext.Consumer>
        {() => {
          return (
            <div className={styles.root}>
              <h2>{formatMessage({ id: 'liquidity-pool' })}</h2>
              <div className={styles.barContainer}>
                <ProgressBar {...publicBar} loading={loading} />
                <div style={{ padding: '28px' }}></div>
                <ProgressBar {...privateBar} loading={loading} />
              </div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
