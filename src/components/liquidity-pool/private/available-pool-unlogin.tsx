import { Component } from 'react';
import { formatMessage } from 'util/i18n';
import { getUnloginPrivateSharePool } from '../../../services/pool.service';
import CoinProgress from '../../card-info/coin-progress';
export default class PoolArea extends Component {
  render() {
    return (
      <CoinProgress
        totalMode={true}
        service={getUnloginPrivateSharePool}
        title={formatMessage({ id: 'available-liquidity' })}
      />
    );
  }
}
