  
import { Component } from 'react';
import CommunityDrived from '../components/sections/community-drived/index';
import WhyDderivatives from '../components/sections/why-dderivatives/index';
import KLine from '../components/k-line/index';

export default class HomePage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div>
      <KLine></KLine>
      <WhyDderivatives />
      <CommunityDrived />
    </div>
  }
}
