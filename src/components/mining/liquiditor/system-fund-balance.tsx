import { Component } from 'react';
import { getLiquiditorSystemBalance } from '../../../services/mining.service';
import CoinCard from '../../card-info/coin-card';
import { formatMessage } from 'locale/i18n';

export default class ReTokenBalance extends Component {
  render() {
    return (
      <CoinCard
        title={formatMessage({ id: 'system-fund-balance' })}
        theme="inner"
        service={getLiquiditorSystemBalance}
      />
    );
  }
}
