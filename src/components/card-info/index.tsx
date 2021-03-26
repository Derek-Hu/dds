import { Descriptions } from 'antd';
import styles from './style.module.less';
import { format } from '../../util/math';
import Placeholder from '../placeholder/index';

interface ICardInfo {
  title: string;
  items:
    | Array<{
        label: string;
        value: any;
      }>
    | { [key: string]: any };
  loading: boolean;
  children?: any;
  isNumber: boolean;
  theme: 'outer' | 'inner';
}
export default ({ title, theme, loading, children, items, isNumber }: ICardInfo) => {
  return (
    <div className={[styles.root, theme === 'outer' ? styles.outer : styles.inner].join(' ')}>
      {theme === 'outer' ? <h2>{title}</h2> : null}
      <div className={styles.card}>
        {theme === 'inner' ? <h2>{title}</h2> : null}
        <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
          {Array.isArray(items)
            ? items.map(({ label, value }, index) => (
                <Descriptions.Item key={index} label={label} span={24}>
                  <Placeholder width={'32%'} loading={loading}>
                    {isNumber ? format(value) : value}
                  </Placeholder>
                </Descriptions.Item>
              ))
            : items
            ? Object.keys(items).map(key => (
                <Descriptions.Item key={key} label={key} span={24}>
                  <Placeholder width={'32%'} loading={loading}>
                    {isNumber ? format(items[key]) : items[key]}
                  </Placeholder>
                </Descriptions.Item>
              ))
            : null}
        </Descriptions>
        {children}
      </div>
    </div>
  );
};
