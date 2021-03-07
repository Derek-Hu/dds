import { Progress, Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';

export interface IBarData {
  title?: string;
  percentage?: number;
  desc?: string;
  value?: any;
  unit?: string;
}
export default ({ percentage, value, desc, title, unit }: IBarData) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={isMobile ? styles.mobile : ''}>
          <Row>
            <Col span={12} className={styles.left}>
              <span className={styles.today}>{title}</span>
              <br />
              <span className={styles.percentage}>{percentage}%</span>
            </Col>
            <Col span={12} className={styles.right}>
              <span className={styles.amount}>{desc}</span>
              <br />
              <span className={styles.dds}>{value}</span>&nbsp;
              <span className={styles.unit}>{unit}</span>
            </Col>
          </Row>
          <Progress
            percent={percentage}
            strokeColor={{ from: '#0072F4', to: '#0055FF' }}
            strokeWidth={isMobile ? 15 : 20}
            showInfo={false}
            strokeLinecap="square"
          />
        </div>
      )}
    </SiteContext.Consumer>
  );
};
