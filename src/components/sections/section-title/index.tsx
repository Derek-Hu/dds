import styles from './style.module.less';

export default ({title, children, noMarginBottom}: {title: string, children?: any, noMarginBottom?: boolean}) => {
  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc} style={noMarginBottom?{marginBottom: '0'}: {}}>{children}</p>
    </>
  );
};
