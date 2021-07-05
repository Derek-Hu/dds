import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col, Icon } from 'antd';

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
    <div className={styles.whatWeBuild}>
      <div className={styles.content}>
        <h2>
          Why we build <br />
          Shield
        </h2>
        <p>
          The first long-term on-chain options <br /> without the effort, risk, or expense of rolling positions.
        </p>
        <div className={styles.details}>
          <Row gutter={50} type="flex">
            <Col span={colSize} className={styles.detailRow}>
              <div className={[styles.detailItem, styles.active].join(' ')}>
                <Image src={oneImg} />
                <p>Third-party custody, centralized platform in control of your funds</p>
              </div>
            </Col>
            <Col span={colSize} className={styles.detailRow}>
              <div className={styles.detailItem}>
                <Image src={twoImg} />
                <p>Intransparent trading system lead to CEX profits</p>
              </div>
            </Col>
            <Col span={colSize} className={styles.detailRow}>
              <div className={styles.detailItem}>
                <Image src={threeImg} />
                <p>CEX charges a large amount of "intermediary tax"</p>
              </div>
            </Col>
            <Col span={colSize} className={styles.detailRow}>
              <div className={styles.detailItem}>
                <Image src={fourImg} />
                <p>Subject to trust and regulation boundary, high user barrier when accessing the market</p>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.arrowDown}>
          <Icon type="down-circle" />
        </div>
        <div className={styles.bottomAds}>
          <div className={styles.comment}>
            <div></div>
          </div>
          <Row gutter={40} type="flex" justify="center">
            <Col span={adColSize} className={styles.adRow}>
              <div className={[styles.adItem, styles.active].join(' ')}>
                <Image src={adsoneImg} />
                <p>Non custodial</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adstwoImg} />
                <p>0 intermediary tax</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsthreeImg} />
                <p>Trading transparency</p>
              </div>
            </Col>
          </Row>
          <Row gutter={40} type="flex" justify="center" className={styles.secondRow}>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsfourImg} />
                <p>Borderless & permissionless</p>
              </div>
            </Col>
            <Col span={adColSize} className={styles.adRow}>
              <div className={styles.adItem}>
                <Image src={adsfiveImg} />
                <p>Easy access</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
