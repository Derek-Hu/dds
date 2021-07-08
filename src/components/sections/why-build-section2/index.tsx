import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col, Icon } from 'antd';
import { CSS_H_SCALE } from '../../../constant/index';

import oneImg from '../../../assets/why-build/one@2x.png';
import twoImg from '../../../assets/why-build/two@2x.png';
import threeImg from '../../../assets/why-build/three@2x.png';
import fourImg from '../../../assets/why-build/four@2x.png';

import adsoneImg from '../../../assets/why-build/11.svg';
import adstwoImg from '../../../assets/why-build/22.svg';
import adsthreeImg from '../../../assets/why-build/33.svg';
import adsfourImg from '../../../assets/why-build/44.svg';
import adsfiveImg from '../../../assets/why-build/55.svg';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.itemImg}>
      <img src={src} />
    </div>
  );
};

const colSize = 6;
const adColSize = 8;

export default () => {
  return (
    <div className={styles.whatWeBuildSection2}>
      <div className={[styles.content, CSS_H_SCALE].join(' ')}>
        <div className={styles.bottomAds}>
          <div className={styles.comment}>
            <div></div>
          </div>
          <Row gutter={40} type="flex" justify="center">
            <Col span={adColSize} className={styles.adRow}>
              <div className={[styles.adItem, styles.active].join(' ')}>
                <Image src={adsoneImg} />
                <p>Non-custodial in nature</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adstwoImg} />
                <p>Transparent rules enforced by the blockchain</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsthreeImg} />
                <p>0 intermediary tax</p>
              </div>
            </Col>
          </Row>
          <Row gutter={40} type="flex" justify="center" className={styles.secondRow}>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsfourImg} />
                <p>Borderless &amp; permissionless</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsfiveImg} />
                <p>
                  Easily accessible
                  <br />
                  (No KYC, email, or registration required)
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
