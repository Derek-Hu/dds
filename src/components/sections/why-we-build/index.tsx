import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col, Icon } from 'antd';
import { CSS_H_SCALE } from '../../../constant/index';

import threeImg from '../../../assets/why-build/one@2x.png';
import fourImg from '../../../assets/why-build/two@2x.png';
import twoImg from '../../../assets/why-build/three@2x.png';
import oneImg from '../../../assets/why-build/four@2x.png';

import { Parallax } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';

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
      <div className={[styles.content, CSS_H_SCALE].join(' ')}>
        <Parallax animation={{ x: 0 }} style={{ transform: 'translateX(-100px)', margin: '10px auto' }}>
          <h2>
            Why we build <br />
            Shield
          </h2>
        </Parallax>
        <TweenOne key="1" animation={{ y: 100, type: 'from', delay: 300, opacity: 0 }} reverseDelay={200}>
          <p>The current derivatives market gap is not optimal</p>
          <div className={styles.details}>
            <Row gutter={50} type="flex">
              <Col span={colSize} className={styles.detailRow}>
                <div className={[styles.detailItem, styles.active].join(' ')}>
                  <Image src={oneImg} />
                  <p>Third-party custody and centralized platforms control your funds</p>
                </div>
              </Col>
              <Col span={colSize} className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <Image src={threeImg} />
                  <p>Intransparent trading system lead to CEX profits only</p>
                </div>
              </Col>
              <Col span={colSize} className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <Image src={fourImg} />
                  <p>CEX charges a large amount of "intermediary tax"</p>
                </div>
              </Col>
              <Col span={colSize} className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <Image src={twoImg} />
                  <p>Accessing is difficult due to trust and regulation boundary.</p>
                </div>
              </Col>
            </Row>
          </div>
        </TweenOne>
        <div className={styles.arrowDown}>
          <Icon type="down-circle" />
        </div>
      </div>
    </div>
  );
};
