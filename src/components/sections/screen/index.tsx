import styles from './style.module.less';

export default ({ children, ...rest }: any) => {
  return (
    <div className={styles.oneScrren} {...rest}>
      <div>{children}</div>
    </div>
  );
};
