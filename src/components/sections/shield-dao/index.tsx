import { Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import AdsImage from '../../../assets/shield-dao.png';
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
          <img alt="" src={AdsImage} width="56%" />
          <div>
            <h3>Shield DAO</h3>
            <p>We're not going to be a company</p>
            <span>ShieldDao is committed to being an open global decentralized cloud governance organization.</span>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
