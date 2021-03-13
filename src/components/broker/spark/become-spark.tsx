import { Row, Col } from 'antd';
import styles from '../become-spark.module.less';
import { formatInt, format } from '../../../util/math';

export interface ISpark {
  percentage?: number;
  contry: string;
  sparks: number;
  referals?: number;
  bonus?: number;
}

export default ({ percentage, contry, sparks, referals, bonus }: ISpark) => {
  return (
    <div className={styles.root}>
      <h3>Become DDerivatives's Spark</h3>
      <p className={styles.descOne}>Spread DeFi Spark To The Old World Make Your Influence Into Affluence</p>
      <div className={styles.percentage}>{percentage}%</div>
      <p className={styles.descTwo}>Settlements Fee Commission</p>
      <Row className={styles.tabSpark}>
        <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
          <span className={styles.ads}>{contry}</span>
          <span>Countries</span>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
          <span className={styles.ads}>{formatInt(sparks)}</span>
          <span>Sparks</span>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
          <span className={styles.ads}>{formatInt(referals)}</span>
          <span>Referals</span>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
          <span className={styles.ads}>{format(bonus)}</span>
          <span>Bonus(USD)</span>
        </Col>
      </Row>
    </div>
  );
};
