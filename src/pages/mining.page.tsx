  
import { Component } from 'react';
import Mining from '../components/mining/index';

export default class MiningPage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <Mining />
  }
}
