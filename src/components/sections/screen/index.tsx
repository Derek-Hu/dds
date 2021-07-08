import styles from './style.module.less';

export default ({ children, className, ...rest }: any) => {
  return (
    <div className={[styles.oneScrren, className].join(' ')} {...rest}>
      <div>{children}</div>
    </div>
  );
};
