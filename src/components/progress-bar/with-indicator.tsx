import { Progress } from "antd";
import FillGrid from "../fill-grid";
import styles from "./with.module.less";

export interface IIndicatorProgress {
  label: string;
  percentage: number;
  val: number;
}
export default (data: IIndicatorProgress) => {
  const { label, percentage, val } = data;
  return (
    <div className={styles.root}>
      <FillGrid
        className={styles.bar}
        left={<span className={styles.label}>{label}</span>}
        right={
          <div>
            <p className={styles.indicator}>
              <span>{percentage}%</span>
              <span style={{left: percentage+'%'}}>{val}</span>
            </p>
            <Progress percent={percentage} showInfo={false} />
          </div>
        }
      />
    </div>
  );
};
