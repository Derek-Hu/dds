import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { Icon } from 'antd';
import { formatMessage } from 'locale/i18n';

export default () => {
  return (
    <div className={styles.root}>
      <SectionTitle title={formatMessage({ id: 'how-to-trade-risk-free-perpetual' })} />
      <p className={styles.try}>
        {formatMessage({ id: 'try-this-demo' })}{' '}
        <span>
          <Icon type="arrow-down" />
        </span>
      </p>

      <div className={styles.desktop}>
        <div className={styles.topBar}>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
        </div>
        <div className={styles.demo}></div>
      </div>
    </div>
  );
};
