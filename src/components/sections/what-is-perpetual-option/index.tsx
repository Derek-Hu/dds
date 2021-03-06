import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import oneImg from '../../../assets/landing/1.svg';
import twoImg from '../../../assets/landing/2.svg';
import threeImg from '../../../assets/landing/3.svg';
import fourImg from '../../../assets/landing/4.svg';
import fiveImg from '../../../assets/landing/5.svg';

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
    <div className={styles.whatIsPerpetual}>
      <div className={styles.leftContent}>
        <h2>
          What’s
          <br />
          perpetual <br />
          option
        </h2>
        <p>
          The first long-term on-chain options <br />
          without the effort, risk, or expense of rolling positions.
        </p>
        <div className={styles.details}>
          <h3>For option traders</h3>
          <Row>
            <Col span={colSize}>
              <div className={styles.detailItem}>
                <Image src={oneImg} />
                <p>Exercise anytime with no expiration date</p>
              </div>
            </Col>
            <Col span={colSize}>
              <div className={styles.detailItem}>
                <Image src={twoImg} />
                <p>Long-term exposure without the need to roll position, decrease operational work, and risk</p>
              </div>
            </Col>
            <Col span={colSize}>
              <div className={styles.detailItem}>
                <Image src={threeImg} />
                <p>Concentrated liquidity to avoid liquidity fragmentation by different expiration dates and prices</p>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.details}>
          <h3>For perpetual traders</h3>
          <Row>
            <Col span={colSize}>
              <div className={styles.detailItem}>
                <Image src={fourImg} />
                <p>No position loss; Wrong directional trading only loss of daily funding fee</p>
              </div>
            </Col>
            <Col span={colSize}>
              <div className={styles.detailItem}>
                <Image src={fiveImg} />
                <p>On-chain leverage from 100x to 1000x</p>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.milestone}>
          <ul>
            <li className={styles.active}>
              <span>V1.0</span>
              <p>Perpetual Option</p>
            </li>
            <li>
              <span>12/2021 V2.0</span>
              <p>Standard Perpetual</p>
            </li>
            <li>
              <span>06/2022 V3.0</span>
              <p>Structures</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
