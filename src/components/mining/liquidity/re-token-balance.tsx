import { Component } from 'react';
import { getLiquidityReTokenBalance } from '../../../services/mining.service';
import CoinCard from '../../card-info/coin-card';
import { formatMessage } from '~/util/i18n';

export default class ReTokenBalance extends Component {
  render() {
    return (
      <CoinCard
        title={formatMessage({ id: 'your-retoken-balance' })}
        theme="inner"
        service={getLiquidityReTokenBalance}
      />
    );
  }
}
