import React from 'react';
import { Carousel, Avatar } from 'antd';
import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import Datasource from './says';

export default () => {
  return (
    <div className={styles.root}>
      <SectionTitle title="We are Community Drived">
        Our community members come from all over the world and share the dream of decentralized finance.
      </SectionTitle>
      <Carousel autoplay>
        {Datasource.map(({ name, avatar, description }) => (
          <div key={name}>
            <Avatar size={64} src={avatar} />
            <div className={styles.name}>{name}</div>
            <p className={styles.description}>{description}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
