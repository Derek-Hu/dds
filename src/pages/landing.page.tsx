import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import WhatIsPerpetual from '../components/sections/what-is-perpetual-option/index';
import ShieldDAO from '../components/sections/shield-dao/index';
import JoinCommunity from '../components/sections/join-comunity/index';
import Partners from '../components/sections/partners/index';
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
        <ShieldDAO></ShieldDAO>
        <JoinCommunity></JoinCommunity>
        <Partners></Partners>
        <WhatIsPerpetual></WhatIsPerpetual>
        {/* <NonRisk></NonRisk> */}
        {/* <HowTrade></HowTrade> */}
        {/* <WhyDderivatives /> */}
        {/* <CommunityDrived /> */}
        {/* <ContactUs /> */}
      </div>
    );
  }
}
