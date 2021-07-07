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

const adsImage = (
  <Col xs={24} sm={24} md={24} lg={10} className={styles.imgContainer}>
    <img alt="" src={AdsImage} width="56%" />
  </Col>
);

export default () => {
  // const [message, setMesg] = useState<string>('Company');

  // useEffect(() => {
  //   const doAnimation = (source: any, output: any) => {
  //     return new Promise(reslove => {
  //       // eslint-disable-next-line
  //       const typing = new Typing({
  //         source,
  //         output,
  //         delay: 80,
  //         done: function () {
  //           reslove(null);
  //         }, //完成打印后的回调事件
  //       });
  //       typing.start();
  //     });
  //   };
  //   const doAll = async () => {
  //     // eslint-disable-next-line
  //     while(true){
  //       await doAnimation('start', 'output');
  //       await doAnimation('start', 'output');
  //       await doAnimation('start', 'output');
  //     }
  //   }

  //   doAll();

  // }, []);

  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.shieldDao}>
          {/* <img alt="" src={AdsImage} width="56%" /> */}
          <p>Company/Foundation/Business organization</p>
          <div className={styles.bgImg}>
            <div>
              <h3>
                Shield DAO is not a
                <p id="output-wrap">
                  <span id="output"></span>
                  <span className="typing-cursor">|</span>
                </p>
              </h3>
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
            </div>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
