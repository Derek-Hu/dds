import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import Pool from '../pool';
import { getCollaborativeLiquidityProvided } from '../../../services/pool.service';
import CoinCard from '../../card-info/coin-card';

export default class LiquidityProvided extends Component {
  render() {
    return <CoinCard title="Liquidity Provided" theme="inner" service={getCollaborativeLiquidityProvided} />;
  }
}
