import { Progress } from "antd";
import FillGrid from "../fill-grid";
import styles from "./with.module.less";

export interface IIndicatorProgress {
  label: string;
  percentage: number;
  val: any;
}
export default ({
  data,
  totalMode,
}: {
  data: IIndicatorProgress;
  totalMode: boolean;
}) => {
  const { label, percentage, val } = data;
  const style = totalMode
    ? {
        color: "#333333",
        left: "auto",
        right: 0,
        transform: "translate(0, 0)",
      }
    : { left: percentage + "%" };
  return (
    <div className={styles.root}>
      <FillGrid
        className={styles.bar}
        left={<span className={styles.label}>{label}</span>}
        right={
          <div>
            <p className={styles.indicator}>
              <span>{percentage}%</span>
              <span style={style}>{val}</span>
            </p>
            <Progress percent={percentage} showInfo={false} />
          </div>
        }
      />
    </div>
  );
};
