  
import { Component } from 'react';
import Header from '../components/header/index';

export default class TradeLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <Header/>
        {
          children
        }
      </div>
    );
  }
}
