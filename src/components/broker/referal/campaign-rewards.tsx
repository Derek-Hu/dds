import { Component } from 'react';
import { format } from '../../../util/math';
import SiteContext, { ISiteContextProps } from '../../../layouts/SiteContext';
import { getBrokerCampaignRewardData } from '../../../services/broker.service';
import styles from './campaign-rewards.module.less';
import Placeholder from '../../placeholder';

export default class CampaignRewards extends Component {
  state = {
    isLoading: true,
    rewardAmount: {
      DAI: 0,
      USDT: 0,
      USDC: 0,
    },
  };

  public componentDidMount = () => {
    this.loadRewardAmount();
  };

  private loadRewardAmount() {
    getBrokerCampaignRewardData().then((coinItems: ICoinItem[]) => {
      const reducer = (amount: any, item: ICoinItem) => {
        amount[item.coin] = item.amount;
        return amount;
      };
      const rewardAmount = coinItems.reduce(reducer, {});

      this.setState({ rewardAmount, isLoading: false });
    });
  }

  render() {
    const rs = (
      <SiteContext.Consumer>
        {({ isMobile }: ISiteContextProps) => {
          const rootClassName = [styles.root, isMobile ? styles.mobile : ''].join(' ');

          const card = (
            <div className={rootClassName}>
              <h2 className={styles.title}>Campaign Rewards</h2>

              <div className={styles.content}>
                <div className={styles.coinValue}>
                  <span className={styles.label}>DAI</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.DAI)}
                    </Placeholder>
                  </span>
                </div>
                <div className={styles.coinValue}>
                  <span className={styles.label}>USDT</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.USDT)}
                    </Placeholder>
                  </span>
                </div>
                <div className={styles.coinValue}>
                  <span className={styles.label}>USDC</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.USDC)}
                    </Placeholder>
                  </span>
                </div>

                <div className={styles.rewardRecord}>
                  <span>Rewards Record</span>
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
