import { Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import AdsImage from '~/assets/imgs/adsImage.png';

const adsImage = (
  <Col xs={24} sm={24} md={24} lg={10} className={styles.imgContainer}>
    <img alt="" src={AdsImage} width="56%" />
  </Col>
);

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.root}>
          <div>
            <Row>
              {isMobile ? null : adsImage}
              <Col xs={24} sm={24} md={24} lg={14} className={styles.message}>
                <h3>What is Shield</h3>
                <p className={styles.advantage}>
                  A decentralized exchange for trading perpetual without position loss.
                </p>
                <p className={styles.desc}>
                  Shield devotes to developing a trustless, censorship-resistant and accessible protocol based on a
                  fully non-cooperative game—the next generation of global derivative infrastructure.
                </p>
              </Col>
              {isMobile ? adsImage : null}
            </Row>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
