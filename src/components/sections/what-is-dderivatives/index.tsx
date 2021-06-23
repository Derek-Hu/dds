import { Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import AdsImage from '../../../assets/imgs/adsImage.png';
import { formatMessage } from 'locale/i18n';

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
                <h3>{formatMessage({ id: 'what-is-shield' })}</h3>
                <p className={styles.advantage}>{formatMessage({ id: 'shield-brief-intro' })}</p>
                <p className={styles.desc}>{formatMessage({ id: 'shield-detail-intro' })}</p>
              </Col>
              {isMobile ? adsImage : null}
            </Row>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
