import { Component } from 'react';
import { formatMessage } from 'util/i18n';
import { getPrivateSharePool } from '../../../services/pool.service';
import CoinProgress from '../../card-info/coin-progress';
export default class PoolArea extends Component {
  render() {
    return (
      <CoinProgress
        totalMode={true}
        service={getPrivateSharePool}
        title={formatMessage({ id: 'available-liquidity' })}
      />
    );
  }
}
