import React from 'react';
import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { Row, Col } from 'antd';
import { datasourceOne, datasourceTwo } from './datasource';
import { formatMessage } from '~/util/i18n';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <SectionTitle title={formatMessage({ id: 'why-trade-with-shield' })}>
          {formatMessage({ id: 'trade-with-shield-reason' })}
        </SectionTitle>
        <Row className={styles.adsOne}>
          {datasourceOne.map(({ icon, name, description }, index) => (
            <Col xs={24} sm={24} md={24} lg={8} key={index}>
              <div className={styles.item}>
                <div>{icon}</div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ background: '#1346FF' }}>
        <div className={styles.content}>
          <Row className={styles.adsTwo}>
            {datasourceTwo.map(({ icon, name, description }, index) => (
              <Col xs={24} sm={24} md={24} lg={8} key={index}>
                <div className={styles.item}>
                  <div>{icon}</div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};
