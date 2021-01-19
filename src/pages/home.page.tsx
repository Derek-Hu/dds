import { Component } from "react";
import CommunityDrived from "../components/sections/community-drived/index";
import WhyDderivatives from "../components/sections/why-dderivatives/index";
import ContactUs from "../components/sections/contact-us/index";
import WhatIs from "../components/sections/what-is-dderivatives/index";
import NonRisk from "../components/non-risk-perpetual/index";
import HowTrade from "../components/sections/how-to-trade/index";
import Banner from "../components/banner/index";
import KLine from "../components/k-line/index";
import SiteContext from "../layouts/SiteContext";

export default class HomePage extends Component {
  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <Banner></Banner>
            <WhatIs></WhatIs>
            <NonRisk></NonRisk>
            {/* <KLine></KLine> */}
            {/* <HowTrade></HowTrade> */}
            <WhyDderivatives />
            <CommunityDrived />
            <ContactUs />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
