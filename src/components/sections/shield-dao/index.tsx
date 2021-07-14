import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import AdsImage from '../../../assets/shield-dao.png';
import { formatMessage } from 'locale/i18n';
import { Carousel, Avatar } from 'antd';
import carouselStyles from './carousel.module.less';
import SectionTitle from '../section-title/index';
import Datasource from './says';
import { Parallax } from 'rc-scroll-anim';

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.shieldDao}>
          {/* <img alt="" src={AdsImage} width="56%" /> */}
          {/* <p>Company/Foundation/Business organization</p> */}
          <div className={styles.bgImg}>
            <div>
              <Parallax animation={{ y: 70, type: 'from', delay: 300, opacity: 0 }}>
                <h3>Shield DAO is not a</h3>
                <p>ShieldDAO is committed to becoming an open global decentralized governance organization.</p>
                <div className={carouselStyles.carousel}>
                  <Carousel autoplay>
                    {Datasource.map(({ name, avatar, description }) => (
                      <div key={name}>
                        <Avatar size={64} src={avatar} />
                        <div className={carouselStyles.name}>{name}</div>
                        <p className={carouselStyles.description}>{description}</p>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
