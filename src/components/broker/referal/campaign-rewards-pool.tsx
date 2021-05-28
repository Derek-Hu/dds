import { Component } from 'react';
import { getBrokerCampaignPool } from '../../../services/broker.service';
import styles from './campaign-rewards-pool.module.less';
import { format } from '../../../util/math';
import Placeholder from '../../placeholder';
import SiteContext, { ISiteContextProps } from '../../../layouts/SiteContext';

type PoolData = {
  DAI: { share: string; total: string };
  USDT: { share: string; total: string };
  USDC: { share: string; total: string };
};

interface IState {
  loading: boolean;
  nextDistribution?: string;
  poolData: PoolData;
}

export default class CampaignRewardsPool extends Component<any, IState> {
  state: IState = {
    loading: true,
    poolData: {
      DAI: { share: '0.00', total: '0.00' },
      USDT: { share: '0.00', total: '0.00' },
      USDC: { share: '0.00', total: '0.00' },
    },
  };

  async componentDidMount() {
    //this.setState({ loading: true });

    const { data, nextDistribution } = await getBrokerCampaignPool();
    const pool: PoolData = data.reduce((acc: any, cur: ICoinItem) => {
      acc[cur.coin] = { share: format(cur.amount), total: format(cur.total) };
      return acc;
    }, {});

    this.setState({ poolData: pool, loading: false, nextDistribution });
  }

  render() {
    const { loading, nextDistribution } = this.state;

    const rs = (
      <SiteContext.Consumer>
        {({ isMobile }: ISiteContextProps) => {
          const rootClassName = [styles.root, isMobile ? styles.mobile : ''].join(' ');

          const card = (
            <div className={rootClassName}>
              <h2 className={styles.title}>Campaign Rewards Pool</h2>
              <div className={styles.distribution}>
                <Placeholder width={'90%'} loading={loading}>
                  Next distribution time: <span className={styles.time}>{nextDistribution}</span>
                </Placeholder>
              </div>

              <div className={styles.coinTable}>
                <div className={[styles.coinValueItem, styles.colTitle].join(' ')}>
                  <div className={styles.coinName}>&nbsp;</div>
                  <div className={styles.coinShare}>Your Share</div>
                  <div className={styles.coinTotal}>Total</div>
                </div>

                <div className={styles.coinValueItem}>
                  <div className={styles.coinName}>DAI</div>
                  <div className={styles.coinShare}>
                    <Placeholder width={'90%'} loading={loading}>
                      {this.state.poolData.DAI.share}
                    </Placeholder>
                  </div>
                  <div className={styles.coinTotal}>
                    <Placeholder width={'100%'} loading={loading}>
                      {this.state.poolData.DAI.total}
                    </Placeholder>
                  </div>
                </div>

                <div className={styles.coinValueItem}>
                  <div className={styles.coinName}>USDT</div>
                  <div className={styles.coinShare}>
                    <Placeholder width={'90%'} loading={loading}>
                      {this.state.poolData.USDT.share}
                    </Placeholder>
                  </div>
                  <div className={styles.coinTotal}>
                    <Placeholder width={'100%'} loading={loading}>
                      {this.state.poolData.USDT.total}
                    </Placeholder>
                  </div>
                </div>

                <div className={styles.coinValueItem}>
                  <div className={styles.coinName}>USDC</div>
                  <div className={styles.coinShare}>
                    <Placeholder width={'90%'} loading={loading}>
                      {this.state.poolData.USDC.share}
                    </Placeholder>
                  </div>
                  <div className={styles.coinTotal}>
                    <Placeholder width={'100%'} loading={loading}>
                      {this.state.poolData.USDC.total}
                    </Placeholder>
                  </div>
                </div>
              </div>
            </div>
          );

          return card;
        }}
      </SiteContext.Consumer>
    );

    return rs;
  }
}
