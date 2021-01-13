import styles from "./style.module.less";

interface IProps {
    left: React.ReactElement;
    right: React.ReactElement;
    children?: React.ReactElement;
}
export default ({left, right, children}: IProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.leftCol}>{left}
      </div>
      <div className={styles.rightCol}>{right}
      </div>
      {children}
    </div>
  );
};
