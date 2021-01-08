  
import { Component } from 'react';
import CommunityDrived from '../components/sections/community-drived/index';
import WhyDderivatives from '../components/sections/why-dderivatives/index';
import ContactUs from '../components/sections/contact-us/index';
import WhatIs from '../components/sections/what-is-dderivatives/index';
import NonRisk from '../components/non-risk-perpetual/index';
import Banner from '../components/banner/index';
import KLine from '../components/k-line/index';

export default class HomePage extends Component {
  render() {
    return <div>
      <Banner></Banner>
      <WhatIs></WhatIs>
      <NonRisk></NonRisk>
      <KLine></KLine>
      <WhyDderivatives />
      <CommunityDrived />
      <ContactUs />
    </div>
  }
}
