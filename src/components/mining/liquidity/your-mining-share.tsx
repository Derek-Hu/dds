import { Component } from 'react';
import { getLiquidityMiningShare } from '../../../services/mining.service';
import CoinProgress from '../../card-info/coin-progress';
import { formatMessage } from 'util/i18n';

export default class PoolArea extends Component {
  render() {
    return (
      <CoinProgress
        totalMode={true}
        service={getLiquidityMiningShare}
        title={formatMessage({ id: 'your-liquidity-mining-share' })}
      />
    );
  }
}
