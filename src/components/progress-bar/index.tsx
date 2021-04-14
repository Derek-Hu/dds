import { Progress, Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import Placeholder from '../placeholder/index';

export interface IBarData {
  title?: string;
  percentage?: number;
  desc?: string;
  value?: any;
  unit?: string;
  loading: boolean;
}
export default (props: IBarData) => {
  const { percentage, value, loading, desc, title, unit } = props || {};
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={isMobile ? styles.mobile : ''}>
          <Row>
            <Col span={12} className={styles.left}>
              <span className={styles.today}>{title}</span>
            </Col>
            <Col span={12} className={styles.right}>
              <span className={styles.amount}>{desc}</span>
            </Col>
          </Row>
          <Placeholder loading={loading} style={loading ? { margin: '12px 0' } : {}}>
            <div className={styles.barValues}>
              <span>
                <span className={styles.percentage}>{percentage}%</span>
              </span>
              <span>
                <span className={styles.dds}>
                  <Placeholder loading={loading}>{value}</Placeholder>
                </span>
                &nbsp;
                {loading ? null : <span className={styles.unit}>{unit}</span>}
              </span>
            </div>
          </Placeholder>
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
