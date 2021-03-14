import { Component } from 'react';
import { Button, Col } from 'antd';
import styles from '../style.module.less';
import { getLiquidityLockedReward } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';

interface IState {
  loading: boolean;
  data?: number;
}
export default class LiquiditorReward extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getLiquidityLockedReward(this.context.account?.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  showWithDraw = () => {};
  showClaimModal = () => {
    
  }
  render() {
    const { data, loading } = this.state;
    return (
      <Hidden when={loading}>
        <h3>{this.context.account?.address ? 'Your Liquidity Locked Rewards' : 'Liquidity Locked Rewards Today'}</h3>
        <p className={styles.coins}>{format(data)} DDS</p>
        <Auth>
        <p className={styles.dynamic}>
            <span>Only reward for liquidity locked in private pool</span>
          </p>
          <div>
            <Button type="primary" className={[styles.btn, styles.cliamBtn].join(' ')} onClick={this.showClaimModal}>
              Claim
            </Button>
            <div>
              <Button type="link" onClick={this.showWithDraw} className={styles.recordLink}>
                Rewards Balance Record
              </Button>
            </div>
          </div>
        </Auth>
      </Hidden>
    );
  }
}
