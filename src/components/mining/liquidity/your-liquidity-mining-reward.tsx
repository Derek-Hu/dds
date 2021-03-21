import { Component } from 'react';
import styles from '../style.module.less';
import { getLiquidityMiningReward } from '../../../services/mining.service';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';
import Placeholder from '../../placeholder/index';

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
    const data = await getLiquidityMiningReward(this.context.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { amount } = data || {};
    return (
      <div>
        <Auth>
          <h3>Your Liquidity Rewards</h3>
        </Auth>
        <Public>
          <h3>Liquidity Reward Today</h3>
        </Public>
        <p className={styles.coins}>
          <Placeholder loading={loading} width={'10em'}>
            {format(amount)} SLD
          </Placeholder>
        </p>
        <p className={styles.dynamic}>
          <span>Current reward factor </span>
          <br />
          {32} <span>SLD/Block</span>
        </p>
      </div>
    );
  }
}
