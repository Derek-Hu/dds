import { Component } from 'react';
import styles from '../style.module.less';
import rewardStyles from './your-liquidity-mining-reward.module.less';
import { claimPubPoolReTokenRewards, queryReTokenLiquidityRewards } from '../../../services/mining.service';
import SiteContext, { ISiteContextProps } from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';
import Placeholder from '../../placeholder/index';
import { formatMessage } from 'locale/i18n';
import { Button, Col } from 'antd';
import { PublicPoolLiquidityRewards } from '../../../services/mining.service.interface';
import NormalButton from '../../common/buttons/normal-btn';
import { Subject, Subscription } from 'rxjs';

interface IState {
  loading: boolean;
  rewards: PublicPoolLiquidityRewards;
}

type IProps = {
  refreshEvent: Subject<boolean>;
};

export default class LiquidityMiningReward extends Component<IProps, IState> {
  state: IState = {
    loading: false,
    rewards: {
      available: 0,
      vesting: 0,
      unactivated: 0,
      total: 0,
    },
  };

  sub: Subscription | null = null;
  static contextType = SiteContext;

  UNSAFE_componentWillReceiveProps() {
    this.init();
  }

  async componentDidMount() {
    this.init();
    this.sub = this.props.refreshEvent.subscribe(() => {
      this.loadRewards();
    });
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async init() {
    this.setState({ loading: true });
    this.loadRewards();
  }

  loadRewards() {
    queryReTokenLiquidityRewards().then((rewards: PublicPoolLiquidityRewards) => {
      this.setState({ rewards, loading: false });
    });
  }

  public doClaim() {
    claimPubPoolReTokenRewards().then(() => {
      this.loadRewards();
    });
  }

  render() {
    const { rewards, loading } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isBSC }: ISiteContextProps) => (
          <div>
            <Auth>
              <h3>Total Rewards</h3>
            </Auth>
            <Public>
              <h3>Liquidity Reward Today</h3>
            </Public>
            <p className={styles.coins}>
              <Placeholder loading={false} width={'10em'}>
                {format(rewards.total)} SLD
              </Placeholder>
            </p>
            <p className={styles.dynamic}>
              <span>Current reward factor </span>
              <br />
              {isBSC ? 2 : 32} <span>SLD/Block</span>
            </p>

            {isBSC ? (
              <Auth>
                <div className={rewardStyles.rewardDetail}>
                  <h3>Rewards Detail</h3>
                  <Col xs={24} sm={24} md={8} lg={8} className={rewardStyles.rewardCol}>
                    <span className={rewardStyles.sld}>
                      <Placeholder loading={false} width={'6em'}>
                        {format(rewards.available)} SLD
                      </Placeholder>
                    </span>
                    <span className={rewardStyles.desc}>Available</span>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} className={rewardStyles.rewardCol}>
                    <span className={rewardStyles.sld}>
                      <Placeholder loading={false} width={'6em'}>
                        {format(rewards.vesting)} SLD
                      </Placeholder>
                    </span>
                    <span className={rewardStyles.desc}>Vesting</span>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8} className={rewardStyles.rewardCol}>
                    <span className={rewardStyles.sld}>
                      <Placeholder loading={false} width={'6em'}>
                        {format(rewards.unactivated)} SLD
                      </Placeholder>
                    </span>
                    <span className={rewardStyles.desc}>Unactivated</span>
                  </Col>
                </div>

                <div className={rewardStyles.claim}>
                  <NormalButton type="primary" onClick={this.doClaim.bind(this)}>
                    CLAIM
                  </NormalButton>
                </div>
              </Auth>
            ) : null}
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
