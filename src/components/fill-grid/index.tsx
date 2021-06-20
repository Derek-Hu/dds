import styles from './style.module.less';

interface IProps {
  left: React.ReactElement;
  right: React.ReactElement;
  children?: React.ReactElement;
  className?: string;
}
export default ({ left, right, children, className }: IProps) => {
  return (
    <div className={[styles.row, className].join(' ')}>
      <div className={styles.leftCol}>{left}</div>
      <div className={styles.rightCol}>{right}</div>
      {children}
    </div>
  );
};
