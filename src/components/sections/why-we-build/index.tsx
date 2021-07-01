import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import oneImg from '../../../assets/why-build/one@2x.png';
import twoImg from '../../../assets/why-build/two@2x.png';
import threeImg from '../../../assets/why-build/three@2x.png';
import fourImg from '../../../assets/why-build/four@2x.png';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.itemImg}>
      <img src={src} />
    </div>
  );
};

const colSize = 6;

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
        <div className={styles.bottomAds}>
          <ul>
            <li className={styles.active}>
              <div>Non-custodial</div>
            </li>
            <li>
              <div>Trading transparency</div>
            </li>
            <li>
              <div>0 intermediary tax</div>
            </li>
            <li>
              <div>Borderless & permissionless</div>
            </li>
            <li>
              <div>easy access</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
