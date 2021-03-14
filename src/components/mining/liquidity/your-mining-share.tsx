import { Component } from 'react';
import { getUnloginPrivateSharePool } from '../../../services/pool.service';
import CoinProgress from '../../card-info/coin-progress';
export default class PoolArea extends Component {
  render() {
    return <CoinProgress totalMode={true} service={getUnloginPrivateSharePool} title="Your Liauidity Mining Share" />;
  }
}
