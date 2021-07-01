import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import sevenImg from '../../../assets/backed-by/seven-x@2x.png';
import hashkeyImg from '../../../assets/backed-by/hashkey@2x.png';
import atImg from '../../../assets/backed-by/at@2x.png';
import lncubaImg from '../../../assets/backed-by/lncuba@2x.png';
import bonfireImg from '../../../assets/backed-by/bonfire@2x.png';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.imgContainer}>
      <img src={src} />
    </div>
  );
};

export default () => {
  return (
    <div className={styles.howWorks}>
      <div className={styles.workContent}>
        <Row>
          <Col span={12}>
            <div className={styles.leftContent}>
              <h2>
                How shield
                <br /> works
              </h2>
              <Row>
                <Col>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.rightContent}>
              <Image src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'} />
              <p>
                The SLD token is designed to facilitate and incentivize the decentalized goverance of Shield protocol
                and value allocation. It captures value through trading fees and transit 100% value back to the role of
                maintaining the system by mining and buyback mechanism.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
