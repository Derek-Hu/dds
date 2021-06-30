import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

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
      <h2>
        What’s
        <br />
        perpetual <br />
        option
      </h2>
      <p>
        The first long-term on-chain options <br />
        without the effort, risk, or expense of rolling positions .
      </p>
      <div className={styles.details}>
        <h3>For option traders</h3>
        <Row>
          <Col span={colSize}>
            <div className={styles.detailItem}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              <p>Exercise at any moment and has no expiration date</p>
            </div>
          </Col>
          <Col span={colSize}>
            <div className={styles.detailItem}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              <p>Long-term exposure without the need to roll position, decrease opertional work and risk</p>
            </div>
          </Col>
          <Col span={colSize}>
            <div className={styles.detailItem}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              <p>Concentrated liquidity, avoid liquidity fragmentation by differnet expiration date and price</p>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.details}>
        <h3>For perpetual traders</h3>
        <Row>
          <Col span={colSize}>
            <div className={styles.detailItem}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              <p>
                No position loss, the gain has infinite potantial while the maximum loss is capped by the funding fee
              </p>
            </div>
          </Col>
          <Col span={colSize}>
            <div className={styles.detailItem}>
              <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
              <p>Leverage on-chain, up to 100x-1000x</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
