import styles from './style.module.less';

export default ({title, children}: {title: string, children: any}) => {
  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{children}</p>
    </>
  );
};
