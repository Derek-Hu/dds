import { Component } from 'react';
import { Button, Col } from 'antd';
import styles from '../style.module.less';
import { getLiquidityMiningReward } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';

interface IState {
  loading: boolean;
  data?: {
    amount: number;
    refactor: number;
  }
}
export default class LiquidityMiningReward extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getLiquidityMiningReward(this.context.account?.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  showClaimModal = () => {

  }

  render() {
    const { data, loading } = this.state;
    const { refactor, amount } = data || {};
    return (
      <Hidden when={loading}>
        <Auth>
          <h3>Your Liquidity Mining Reward</h3>
        </Auth>
        <Public>
          <h3>Liquidity Mining Reward Today</h3>
        </Public>
        <p className={styles.coins}>{format(amount)} DDS</p>
        <Auth>
        <p className={styles.dynamic}>
            <span>Current reward factor </span>
            <br />
            {refactor} <span>DDS/Block</span>
          </p>
          <Button type="primary" className={styles.btn} onClick={this.showClaimModal}>
            Claim
          </Button>
        </Auth>
      </Hidden>
    )
  }
}
