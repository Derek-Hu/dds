import { Row, Col } from 'antd';
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
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.shieldDao}>
          {/* <img alt="" src={AdsImage} width="56%" /> */}
          <div className={styles.bgImg}>
            <div>
              <h3>Shield DAO</h3>
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
