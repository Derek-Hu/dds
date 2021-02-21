import { Component } from 'react';
import CommunityDrived from '../components/sections/community-drived/index';
import WhyDderivatives from '../components/sections/why-dderivatives/index';
import ContactUs from '../components/sections/contact-us/index';
import WhatIs from '../components/sections/what-is-dderivatives/index';
import NonRisk, { INonRecords } from '../components/non-risk-perpetual/index';
// import HowTrade from '../components/sections/how-to-trade/index';
import Banner from '../components/banner/index';

const nonRisks: INonRecords = {
  total: 32489320,
  data: [
    {
      fromCoin: 'WBTC',
      toCoin: "DAI",
      price: 7173.77,
      change: 8.23,
    },
    {
      fromCoin: 'ETH',
      toCoin: "DAI",
      price: 183.28,
      change: -10.01,
    },
  ]
}
export default class HomePage extends Component {
  render() {
    return <div style={{ background: '#fff' }}>
      <Banner></Banner>
      <WhatIs></WhatIs>
      <NonRisk {...nonRisks}></NonRisk>
      {/* <HowTrade></HowTrade> */}
      <WhyDderivatives />
      <CommunityDrived />
      <ContactUs />
    </div>;
  }
}
