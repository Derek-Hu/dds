import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import WhatIsPerpetual from '../components/sections/what-is-perpetual-option/index';
import ShieldDAO from '../components/sections/shield-dao/index';
import WhyWeBuild from '../components/sections/why-we-build/index';
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
        <WhyWeBuild></WhyWeBuild>
        <WhatIsPerpetual></WhatIsPerpetual>
        <HowWorks></HowWorks>
        <ShieldDAO></ShieldDAO>
        <JoinCommunity></JoinCommunity>
        <Partners></Partners>
        <AsFeature></AsFeature>
        {/* <NonRisk></NonRisk> */}
        {/* <HowTrade></HowTrade> */}
        {/* <WhyDderivatives /> */}
        {/* <CommunityDrived /> */}
        {/* <ContactUs /> */}
      </div>
    );
  }
}
