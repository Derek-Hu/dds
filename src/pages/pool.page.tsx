  
import { Component } from 'react';
import LiquidityPool from '../components/liquidity-pool/index';
export default class PoolPage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div><LiquidityPool/></div>
  }
}
