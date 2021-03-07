import { Descriptions } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';

interface ICardInfo {
  title: string;
  items?: Array<{
    label: string;
    value: any;
  }>;
  children?: any;
  theme: 'outer' | 'inner';
}
export default ({ title, theme, children, items }: ICardInfo) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div
          className={[styles.root, theme === 'outer' ? styles.outer : styles.inner, isMobile ? styles.mobile : ''].join(
            ' '
          )}
        >
          {theme === 'outer' ? <h2>{title}</h2> : null}
          <div className={styles.card}>
            {theme === 'inner' ? <h2>{title}</h2> : null}
            <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
              {items ? items.map(({ label, value }) => (
                <Descriptions.Item label={label} span={24}>
                  {value}
                </Descriptions.Item>
              )) : null }
            </Descriptions>
            {children}
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
