import { Component } from 'react';
import { getBrokerCampaignPool } from '../../../services/broker.service';
import styles from '../campion-pool.module.less';
import PoolProgress from '../../progress-bar/pool-progress';
import { IIndicatorProgress } from '../../progress-bar/with-indicator';
import { dividedPecent } from '../../../util/math';
import { formatMessage } from 'locale/i18n';

interface IState {
  data: Array<IIndicatorProgress>;
  loading: boolean;
  nextDistribution?: string;
}

export default class CampaignRewardsPool extends Component<any, IState> {
  state: IState = {
    data: [],
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const { data, nextDistribution } = await getBrokerCampaignPool();
    this.setState({
      data: data
        ? data.map(({ amount, total, coin }) => ({
            label: coin,
            percentage: dividedPecent(amount, total),
            val: (
              <span>
                {amount}/{total}
              </span>
            ),
          }))
        : [],
      nextDistribution,
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading, nextDistribution } = this.state;
    return loading ? null : (
      <div>
        <PoolProgress
          loading={false}
          totalMode={true}
          title={formatMessage({ id: 'campaign-rewards-pool' })}
          coins={data}
          desc={
            <div>
              <p className="text-center">
                {formatMessage({ id: 'next-distribution-time' })}
                <br />
                <span>{nextDistribution}</span>
              </p>
              ,
              <p className={styles.shareTotalTip}>
                <span>{formatMessage({ id: 'your-share' }, true)}</span>
                <span>{formatMessage({ id: 'total-locked' }, true)}</span>
              </p>
            </div>
          }
        />
      </div>
    );
  }
}
