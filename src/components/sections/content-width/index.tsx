import styles from './style.module.less';

export default ({ children, className, maxWidth, ...rest }: any) => {
  return (
    <div className={[styles.contentWidth, className].join(' ')} style={maxWidth ? { maxWidth } : {}} {...rest}>
      <div>{children}</div>
    </div>
  );
};
