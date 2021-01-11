import styles from "./swap-bar.module.less";

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.L1}></div>
      <div className={styles.L2}></div>
      <div className={styles.L3}></div>
      <div className={styles.L4}></div>
      <div className={styles.L5}></div>
      <div className={styles.L6}></div>
      <div className={styles.L7}></div>
      <div className={styles.L8}></div>

      <ul className="cube-inner">
        <li className="top"></li>
        <li className="bottom"></li>
        <li className="front"></li>
        <li className="back"></li>
        <li className="right"></li>
        <li className="left"></li>
      </ul>
    </div>
  );
};
