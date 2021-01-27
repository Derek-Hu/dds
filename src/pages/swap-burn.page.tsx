import { Component } from 'react';
import SwapBurn from '../components/swap-burn/index';  

export default class SwapBurnPage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div><SwapBurn isLogin={true}/></div>
  }
}
