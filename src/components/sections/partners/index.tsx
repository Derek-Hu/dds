import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import sevenImg from '../../../assets/backed-by/seven-x@2x.png';
import hashkeyImg from '../../../assets/backed-by/hashkey@2x.png';
import atImg from '../../../assets/backed-by/at@2x.png';
import lncubaImg from '../../../assets/backed-by/lncuba@2x.png';
import bonfireImg from '../../../assets/backed-by/bonfire@2x.png';

import hoonImg from '../../../assets/backed-by/hoon@2x.png';
import youbiImg from '../../../assets/backed-by/youbi@2x.png';
import shimaImg from '../../../assets/backed-by/shima@2x.png';
import zonffImg from '../../../assets/backed-by/zonff@2x.png';
import okexImg from '../../../assets/backed-by/okex@2x.png';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.partnerItem}>
      <img src={src} />
    </div>
  );
};

export default () => {
  return (
    <div className={styles.backedBy}>
      <div>
        <h2>Backed By</h2>
        <div className={styles.partnerWpr}>
          <Row>
            <Col span={4} offset={2} className={styles.image1}>
              <Image src={sevenImg} />
            </Col>
            <Col span={4} className={styles.image2}>
              <Image src={hashkeyImg} />
            </Col>
            <Col span={4} className={styles.image3}>
              <Image src={atImg} />
            </Col>
            <Col span={4} className={styles.image4}>
              <Image src={lncubaImg} />
            </Col>
            <Col span={4} className={styles.image5}>
              <Image src={bonfireImg} />
            </Col>
          </Row>
        </div>
        <div className={styles.partnerWpr}>
          <Row>
            <Col span={4} offset={2} className={styles.image6}>
              <Image src={hoonImg} />
            </Col>
            <Col span={4} className={styles.image7}>
              <Image src={youbiImg} />
            </Col>
            <Col span={4} className={styles.image8}>
              <Image src={shimaImg} />
            </Col>
            <Col span={4} className={styles.image9}>
              <Image src={zonffImg} />
            </Col>
            <Col span={4} className={styles.image10}>
              <Image src={okexImg} />
            </Col>
          </Row>
        </div>
        {/* <div className={styles.partnerWpr}>
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
      </div> */}
      </div>
    </div>
  );
};
