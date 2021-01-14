import WithIndicator, {
  IIndicatorProgress,
} from "./with-indicator";
import styles from './pool.module.less';

export interface IMiningShare {
  title: string;
  desc?: any;
  coins: Array<IIndicatorProgress>;
}

export default (props: IMiningShare) => {
  const { title, desc, coins } = props;

  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      <p>{desc}</p>
      {coins.map((coin) => (
        <WithIndicator {...coin} />
      ))}
    </div>
  );
};
