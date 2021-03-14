import { Component } from 'react';
import { getLiquidityReTokenBalance } from '../../../services/mining.service';
import CoinCard from '../../card-info/coin-card';

export default class ReTokenBalance extends Component {
  render() {
    return <CoinCard title="Your reToken Balance" theme="inner" service={getLiquidityReTokenBalance} />;
  }
}
