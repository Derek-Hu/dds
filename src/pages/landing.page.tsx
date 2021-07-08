import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import WhatIsPerpetual from '../components/sections/what-is-perpetual-option/index';
import ShieldDAO from '../components/sections/shield-dao/index';
import Screen from '../components/sections/screen/index';
import WhyWeBuild from '../components/sections/why-we-build/index';
import WhyWeBuild2 from '../components/sections/why-build-section2/index';
import JoinCommunity from '../components/sections/join-comunity/index';
import Partners from '../components/sections/partners/index';
import AsFeature from '../components/sections/as-feature/index';
import HowWorks from '../components/sections/how-works/index';
import Banner from '../components/banner/index';
import { formatInt } from '../util/math';
import styles from './style.module.less';

export default class HomePage extends Component {
  render() {
    return (
      <div style={{ background: '#fff' }}>
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
        <Screen style={{ background: '#1346ff' }}>
          <WhyWeBuild></WhyWeBuild>
        </Screen>
        <Screen style={{ background: '#1346ff' }}>
          <WhyWeBuild2></WhyWeBuild2>
        </Screen>
        <Screen>
          <WhatIsPerpetual></WhatIsPerpetual>
        </Screen>
        <Screen style={{ background: '#000' }}>
          <HowWorks></HowWorks>
        </Screen>
        <Screen>
          <ShieldDAO></ShieldDAO>
          <JoinCommunity></JoinCommunity>
        </Screen>
        <Screen>
          <Partners></Partners>
          <AsFeature></AsFeature>
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
