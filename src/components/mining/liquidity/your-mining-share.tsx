import { Component } from 'react';
import { getLiquidityMiningShare } from '../../../services/mining.service';
import CoinProgress from '../../card-info/coin-progress';
export default class PoolArea extends Component {
  render() {
    return <CoinProgress totalMode={true} service={getLiquidityMiningShare} title="Your Liquidity Mining Share" />;
  }
}
