import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import WhatIsPerpetual from '../components/sections/what-is-perpetual-option/index';
import ShieldDAO from '../components/sections/shield-dao/index';
import Screen from '../components/sections/screen/index';
import ContentWidth from '../components/sections/content-width';
import WhyWeBuild from '../components/sections/why-we-build/index';
import WhyWeBuild2 from '../components/sections/why-build-section2/index';
// import JoinCommunity from '../components/sections/join-comunity/index';
import JoinCommunity from '../components/sections/join-comunity/index-dark';
import Partners from '../components/sections/partners/index';
import AsFeature from '../components/sections/as-feature/index';
import HowWorks from '../components/sections/how-works/index';
import Banner from '../components/banner/index';
import { formatInt } from '../util/math';
import styles from './style.module.less';
import landingStyles from './landing.module.less';
import BannerAnim, { Element } from 'rc-banner-anim';
import { Parallax } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import Header from '../components/header/index';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { SIDs } from '../constant/index';

const limit = 200;
function throttle(func: () => any) {
  let inThrottle = false; // 开关
  return function (...args: any) {
    // @ts-ignore
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        // 定时器用来进行保证在一定时间内开关的状态
        inThrottle = false;
      }, limit);
    }
  };
}

let idx = 0;
export default class HomePage extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.windowScroll);
  }
  windowScroll(...args: any) {
    console.log(...args);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.windowScroll);
  }
  render() {
    return (
      <div style={{ background: '#fff' }}>
        <Screen id={SIDs[idx++]}>
          <Header darkMode={true} />
          <ContentWidth>
            <Banner></Banner>
            {/* <TweenOne animation={{ y: 70, opacity: 0, delay: 400, type: 'from' }}>
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
            </TweenOne> */}
          </ContentWidth>
        </Screen>
        {/* <ScrollOverPack> */}
        {/* <Screen id={SIDs[idx++]} style={{ background: '#FAFAFA' }}>
            <ContentWidth>
              <WhyWeBuild></WhyWeBuild>
            </ContentWidth>
          </Screen> */}
        <Screen id={SIDs[idx++]}>
          <ContentWidth>
            <Parallax animation={{ y: 40, type: 'from', delay: 100, opacity: 0 }}>
              <WhyWeBuild2></WhyWeBuild2>
            </Parallax>
          </ContentWidth>
        </Screen>
        <Screen id={SIDs[idx++]}>
          <ContentWidth>
            <Parallax animation={{ y: 40, type: 'from', delay: 300, opacity: 0 }}>
              <WhatIsPerpetual></WhatIsPerpetual>
            </Parallax>
          </ContentWidth>
        </Screen>
        <Screen id={SIDs[idx++]}>
          <ContentWidth>
            <Parallax animation={{ y: 40, type: 'from', delay: 300, opacity: 0 }}>
              <HowWorks></HowWorks>
            </Parallax>
          </ContentWidth>
        </Screen>
        <Screen id={SIDs[idx++]}>
          {/* <Parallax animation={{ y: 70, type: 'from', delay: 300, opacity: 0 }}> */}
          <div>
            <ContentWidth>
              <ShieldDAO></ShieldDAO>
            </ContentWidth>
            <JoinCommunity></JoinCommunity>
          </div>
          {/* </Parallax> */}
        </Screen>
        <Screen id={SIDs[idx++]}>
          <Parallax animation={{ y: 70, type: 'from', delay: 300, opacity: 0 }}>
            <ContentWidth>
              <Partners></Partners>
              <AsFeature></AsFeature>
            </ContentWidth>
          </Parallax>
        </Screen>
        {/* </ScrollOverPack> */}
        {/* <NonRisk></NonRisk> */}
        {/* <HowTrade></HowTrade> */}
        {/* <WhyDderivatives /> */}
        {/* <CommunityDrived /> */}
        {/* <ContactUs /> */}
      </div>
    );
  }
}
