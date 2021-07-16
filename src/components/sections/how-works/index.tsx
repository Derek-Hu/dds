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
                  <p>
                    Broker: A broker who brings a steady stream of traders to the Shield network through education and
                    referrals, incentivized by the "Broker Campaign" commission system.
                  </p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme2].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>
                    Trader: Buyer of Shield to meet their trading needs, and to pay for trading fees and position
                    charges, etc.
                  </p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme3].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>
                    Liquidator: Trigger liquidation trades for arbitrage rewards by monitoring Taker and Maker positions
                    and discovering insufficient position fees or liquidity margin.
                  </p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme4].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>
                    Private Pool: Seller of Shield who provides the liquidity as a counterparty and receives a liquidity
                    bonus (SLD) for taking orders.
                  </p>
                </Col>
                <Col>
                  <div className={[styles.dots, styles.theme5].join(' ')}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>
                    Public Pool: A pool of reserve liquidity in which everyone can participate by back up liquidity
                    mining to obtain LP rewards (SLD) and only be used when Private Pool is insufficient.
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.rightContent}>
              <Image src={howWorksImg} />
              <p>
                The SLD token is designed to facilitate and incentivize the decentralized governance of the Shield
                protocol and value allocation. It captures value through trading fees and transfers 100% of the value
                back to maintaining the system by efficient mining and an impressive buyback mechanism.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
