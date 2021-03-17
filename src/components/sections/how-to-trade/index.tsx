import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { Icon } from 'antd';

export default () => {
  return (
    <div className={styles.root}>
      <SectionTitle title="How to Trade Risk-free Perpetual" />
      <p className={styles.try}>
        Try this demo{' '}
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
