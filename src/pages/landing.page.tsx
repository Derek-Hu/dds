import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import WhatIsPerpetual from '../components/sections/what-is-perpetual-option/index';
import ShieldDAO from '../components/sections/shield-dao/index';
import Screen from '../components/sections/screen/index';
import ContentWidth from '../components/sections/content-width';
import WhyWeBuild from '../components/sections/why-we-build/index';
import WhyWeBuild2 from '../components/sections/why-build-section2/index';
import JoinCommunity from '../components/sections/join-comunity/index';
import Partners from '../components/sections/partners/index';
import AsFeature from '../components/sections/as-feature/index';
import HowWorks from '../components/sections/how-works/index';
import Banner from '../components/banner/index';
import { formatInt } from '../util/math';
import styles from './style.module.less';
import landingStyles from './landing.module.less';
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import Header from '../components/header/index';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';

export default class HomePage extends Component {
  render() {
    //   return <BannerAnim prefixCls="banner-user">
    //   <Element
    //     prefixCls="banner-user-elem"
    //     key="0"
    //   >
    //     <BgElement
    //       key="bg"
    //       className="bg"
    //       style={{
    //         background: '#364D79',
    //       }}
    //     />
    //     <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
    //       Ant Motion Banner
    //     </TweenOne>
    //     <TweenOne className="banner-user-text"
    //       animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
    //     >
    //       The Fast Way Use Animation In React
    //     </TweenOne>
    //   </Element>
    //   <Element
    //     prefixCls="banner-user-elem"
    //     key="1"
    //   >
    //     <BgElement
    //       key="bg"
    //       className="bg"
    //       style={{
    //         background: '#64CBCC',
    //       }}
    //     />
    //     <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
    //       Ant Motion Banner
    //     </TweenOne>
    //     <TweenOne className="banner-user-text"
    //       animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
    //     >
    //       The Fast Way Use Animation In React
    //     </TweenOne>
    //   </Element>
    // </BannerAnim>;
    return (
      <div style={{ background: '#fff' }}>
        <Screen>
          <Header darkMode={true} />
          <ContentWidth>
            <Banner></Banner>
            <TweenOne className="banner-user-title" animation={{ y: 70, opacity: 0, delay: 400, type: 'from' }}>
              <div className={styles.bannerDatas}>
                <Row>
                  <Col span={6}>
                    <p>{formatInt(13012)}</p>
                    <span>All Time Volum</span>
                  </Col>
                  <Col span={6}>
                    <p>{formatInt(13012)}</p>
                    <span>All Time Volum</span>
                  </Col>
                  <Col span={6}>
                    <p>{formatInt(13012)}</p>
                    <span>All Time Volum</span>
                  </Col>
                  <Col span={6}>
                    <p>{formatInt(13012)}</p>
                    <span>All Time Volum</span>
                  </Col>
                </Row>
              </div>
            </TweenOne>
          </ContentWidth>
        </Screen>
        <ScrollOverPack>
          <Screen style={{ background: '#1346ff' }}>
            <ContentWidth>
              <WhyWeBuild></WhyWeBuild>
            </ContentWidth>
          </Screen>
          <Screen style={{ background: '#1346ff' }}>
            <ContentWidth>
              <WhyWeBuild2></WhyWeBuild2>
            </ContentWidth>
          </Screen>
          <Screen>
            <ContentWidth>
              <WhatIsPerpetual></WhatIsPerpetual>
            </ContentWidth>
          </Screen>
          <Screen style={{ background: '#000' }}>
            <ContentWidth>
              <HowWorks></HowWorks>
            </ContentWidth>
          </Screen>
          <Screen>
            <ContentWidth>
              <ShieldDAO></ShieldDAO>
            </ContentWidth>
            <JoinCommunity></JoinCommunity>
          </Screen>
          <Screen>
            <ContentWidth>
              <Partners></Partners>
              <AsFeature></AsFeature>
            </ContentWidth>
          </Screen>
        </ScrollOverPack>
        {/* <NonRisk></NonRisk> */}
        {/* <HowTrade></HowTrade> */}
        {/* <WhyDderivatives /> */}
        {/* <CommunityDrived /> */}
        {/* <ContactUs /> */}
      </div>
    );
  }
}
