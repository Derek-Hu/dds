import ProgressBar from '../progress-bar/index';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { dividedPecent, format, formatInt } from '../../util/math';
import { formatMessage } from 'locale/i18n';
import { BaseStateComponent } from '../../state-manager/base-state-component';
import { PageTradingPair, PoolInfo } from '../../state-manager/state-types';
import { S } from '../../state-manager/contract/contract-state-parser';
import { toEtherNumber } from '../../util/ethers';
import { P } from '../../state-manager/page/page-state-parser';

interface IState {
  pubPoolInfo: PoolInfo | null;
  priPoolInfo: PoolInfo | null;
  tradePair: PageTradingPair;
}

export default class TradePool extends BaseStateComponent<{}, IState> {
  state: IState = {
    pubPoolInfo: null,
    priPoolInfo: null,
    tradePair: P.Trade.Pair.get(),
  };

  componentDidMount() {
    this.registerState('pubPoolInfo', S.Pool.Info.CurPub);
    this.registerState('priPoolInfo', S.Pool.Info.CurPri);
    this.registerState('tradePair', P.Trade.Pair);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  render() {
    const pubAva = toEtherNumber(this.state.pubPoolInfo?.available, 2, this.state.tradePair.quote);
    const pubTot = toEtherNumber(this.state.pubPoolInfo?.total, 2, this.state.tradePair.quote);
    const priAva = toEtherNumber(this.state.priPoolInfo?.available, 2, this.state.tradePair.quote);
    const priTot = toEtherNumber(this.state.priPoolInfo?.total, 2, this.state.tradePair.quote);
    const isLoading = this.state.priPoolInfo === null || this.state.pubPoolInfo === null;
    const publicBar = {
      title: formatMessage({ id: 'public-pool' }),
      desc: formatMessage({ id: 'available-liquidity' }),
      value: (
        <span>
          {format(pubAva)}/{formatInt(pubTot)}
        </span>
      ),
      percentage: Math.floor(dividedPecent(Number(pubAva), Number(pubTot))),
      unit: this.state.tradePair.quote.description,
    };

    const privateBar = {
      title: formatMessage({ id: 'private-pool' }),
      desc: formatMessage({ id: 'available-liquidity' }),
      value: (
        <span>
          {format(priAva)}/{formatInt(priTot)}
        </span>
      ),
      percentage: Math.floor(dividedPecent(Number(priAva), Number(priTot))),
      unit: this.state.tradePair.quote.description,
    };

    return (
      <SiteContext.Consumer>
        {() => {
          return (
            <div className={styles.root}>
              <h2>{formatMessage({ id: 'liquidity-pool' })}</h2>
              <div className={styles.barContainer}>
                <ProgressBar {...publicBar} loading={isLoading} />
                <div style={{ padding: '28px' }}></div>
                <ProgressBar {...privateBar} loading={isLoading} />
              </div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
