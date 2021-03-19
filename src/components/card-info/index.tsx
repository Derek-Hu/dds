import { Descriptions } from 'antd';
import styles from './style.module.less';
import { format } from '../../util/math';
import Placeholder from '../placeholder/index';

interface ICardInfo {
  title: string;
  items?: Array<{
    label: string;
    value: any;
  }>;
  loading: boolean;
  children?: any;
  theme: 'outer' | 'inner';
}
export default ({ title, theme, loading, children, items }: ICardInfo) => {
  return (
    <div className={[styles.root, theme === 'outer' ? styles.outer : styles.inner].join(' ')}>
      {theme === 'outer' ? <h2>{title}</h2> : null}
      <div className={styles.card}>
        {theme === 'inner' ? <h2>{title}</h2> : null}
        <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
          {items
            ? items.map(({ label, value }) => (
                <Descriptions.Item label={label} span={24}>
                  <Placeholder loading={loading}>{value}</Placeholder>
                </Descriptions.Item>
              ))
            : null}
        </Descriptions>
        {children}
      </div>
    </div>
  );
};
