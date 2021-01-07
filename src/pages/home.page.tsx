  
import { Component } from 'react';
import CommunityDrived from '../components/sections/community-drived/index';
import WhyDderivatives from '../components/sections/why-dderivatives/index';
import ContactUs from '../components/sections/contact-us/index';
import WhatIs from '../components/sections/what-is-dderivatives/index';
import Banner from '../components/banner/index';
import KLine from '../components/k-line/index';

export default class HomePage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <div>
      <Banner></Banner>
      <WhatIs></WhatIs>
      <KLine></KLine>
      <WhyDderivatives />
      <CommunityDrived />
      <ContactUs />
    </div>
  }
}
