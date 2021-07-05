import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import howWorksImg from '../../../assets/how-shield-works.svg';

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
        <Row type="flex" justify="space-between" align="bottom">
          <Col span={12}>
            <div className={styles.leftContent}>
              <h2>
                How shield
                <br /> works
              </h2>
              <Row>
                <Col>
                  <div className={[styles.dots, styles.theme1].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme2].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme3].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme4].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme5].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Leverage on-chain, up to 100x-1000x</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.rightContent}>
              <Image src={howWorksImg} />
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
