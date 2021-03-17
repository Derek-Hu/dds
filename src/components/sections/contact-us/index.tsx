import React from 'react';
import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { Row, Col } from 'antd';
import links from './links';

export default () => (
  <div className={styles.root}>
    <SectionTitle title="Contact us" noMarginBottom>
      Join the community to build the future derivatives.
    </SectionTitle>
    <Row type="flex" justify="center">
      {links.map(({ icon, url }, index) => (
        <Col key={index} xs={4} sm={8} md={3} lg={2}>
          <a href={url}>{icon}</a>
        </Col>
      ))}
    </Row>
  </div>
);
