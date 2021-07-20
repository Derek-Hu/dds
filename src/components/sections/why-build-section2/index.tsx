import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col, Icon } from 'antd';
import { CSS_H_SCALE } from '../../../constant/index';

import oneImg from '../../../assets/why-build/one@2x.png';
import twoImg from '../../../assets/why-build/two@2x.png';
import threeImg from '../../../assets/why-build/three@2x.png';
import fourImg from '../../../assets/why-build/four@2x.png';
import TweenOne from 'rc-tween-one';

import adsoneImg from '../../../assets/why-build/1.svg';
import adstwoImg from '../../../assets/why-build/2.svg';
import adsthreeImg from '../../../assets/why-build/3.svg';
import adsfourImg from '../../../assets/why-build/4.svg';
import adsfiveImg from '../../../assets/why-build/5.svg';

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
          <TweenOne key="1" animation={{ y: 20, type: 'from', delay: 100, opacity: 0 }}>
            {/* <div className={styles.comment}>
            <div></div>
          </div> */}
            <Row>
              <Col span={6}>
                <h3>
                  Why we <br />
                  build <br />
                  Shield
                </h3>
                <p>The first long-term on-chain options without the effort, risk, or expense of rolling positions .</p>
              </Col>
              <Col span={18}>
                <Row gutter={20} type="flex" justify="center">
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
                  <Col span={adColSize} className={styles.adRow}></Col>
                </Row>
              </Col>
            </Row>
          </TweenOne>
        </div>
      </div>
    </div>
  );
};
