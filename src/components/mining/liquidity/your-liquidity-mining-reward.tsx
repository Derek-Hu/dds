import { Component } from 'react';
import { Button, Col } from 'antd';
import styles from '../style.module.less';
import { getLiquidityMiningReward, claimLiquidity } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';

interface IState {
  loading: boolean;
  data?: {
    amount: number;
    refactor: number;
  };
}
export default class LiquidityMiningReward extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getLiquidityMiningReward(this.context.account ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  cofirmClaim = async () => {
    await claimLiquidity();
  };

  render() {
    const { data, loading } = this.state;
    const { refactor, amount } = data || {};
    return (
      <Hidden when={loading}>
        <Auth>
          <h3>Your Liquidity Reward</h3>
        </Auth>
        <Public>
          <h3>Liquidity Reward Today</h3>
        </Public>
        <p className={styles.coins}>{format(amount)} SLD</p>
        <Auth>
          <p className={styles.dynamic}>
            <span>Current reward factor </span>
            <br />
            {32} <span>SLD/Block</span>
          </p>
          {/* <Button type="primary" className={styles.btn} onClick={this.cofirmClaim}>
            Claim
          </Button> */}
        </Auth>
      </Hidden>
    );
  }
}
