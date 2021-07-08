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

export default class HomePage extends Component {
  render() {
    return (
      <div style={{ background: '#fff' }}>
        <Screen className={landingStyles.firstScreen}>
          <ContentWidth>
            <Banner></Banner>
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
          </ContentWidth>
        </Screen>
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
        {/* <NonRisk></NonRisk> */}
        {/* <HowTrade></HowTrade> */}
        {/* <WhyDderivatives /> */}
        {/* <CommunityDrived /> */}
        {/* <ContactUs /> */}
      </div>
    );
  }
}
