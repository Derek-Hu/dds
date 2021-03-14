import { Component } from 'react';
import { getLiquiditorSystemBalance } from '../../../services/mining.service';
import CoinCard from '../../card-info/coin-card';

export default class ReTokenBalance extends Component {
  render() {
    return <CoinCard title="System Fund Balance" theme="inner" service={getLiquiditorSystemBalance} />;
  }
}
