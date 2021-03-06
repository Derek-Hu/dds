  
import { Component } from 'react';
import Broker from '../components/broker/index';
export default class BorkerPage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div><Broker /></div>
  }
}
