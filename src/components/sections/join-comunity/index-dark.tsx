import React from 'react';
import styles from './style.module.less';
import { Row, Col } from 'antd';
import links from './links-dark';
import { formatMessage } from 'locale/i18n';

export default () => (
  <div className={styles.joinCommunity}>
    <h3>Join the community to build the future derivatives</h3>
    <Row type="flex" justify="center">
      {links.map(({ icon, url }, index) => (
        <Col key={index} xs={4} sm={8} md={3} lg={2}>
          <a href={url}>{icon}</a>
        </Col>
      ))}
    </Row>
  </div>
);
