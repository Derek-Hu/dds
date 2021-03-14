import { Component } from 'react';
import { getPrivateSharePool } from '../../../services/pool.service';
import CoinProgress from '../../card-info/coin-progress';
export default class PoolArea extends Component {
  render() {
    return <CoinProgress totalMode={true} service={getPrivateSharePool} title="Available Liquidity" />;
  }
}
