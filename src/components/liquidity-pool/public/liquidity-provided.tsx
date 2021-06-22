import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import Pool from '../pool';
import { getCollaborativeLiquidityProvided } from '../../../services/pool.service';
import CoinCard from '../../card-info/coin-card';
import { formatMessage } from 'util/i18n';

export default class LiquidityProvided extends Component {
  render() {
    return (
      <CoinCard
        title={formatMessage({ id: 'liquidity-provided' })}
        theme="inner"
        service={getCollaborativeLiquidityProvided}
      />
    );
  }
}
