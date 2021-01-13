import { Progress, Row, Col } from "antd";
import styles from "./style.module.less";

export interface IBarData {
  left: {
    title: string;
    percentage: number;
  };
  right: {
    title: string;
    value: any;
  };
  unit: string;
}
export default ({ data }: { data: IBarData }) => {
  const { left, right, unit } = data;
  
  return (
    <>
      <Row>
        <Col span={12} className={styles.left}>
          <span className={styles.today}>{left.title}:</span>
          <br />
          <span className={styles.percentage}>{left.percentage}%</span>
        </Col>
        <Col span={12} className={styles.right}>
          <span className={styles.amount}>{right.title}</span>
          <br />
          <span className={styles.dds}>{right.value}</span>&nbsp;
          <span className={styles.unit}>{unit}</span>
        </Col>
      </Row>
      <Progress
        percent={left.percentage}
        strokeColor={{ from: "#0072F4", to: "#0055FF" }}
        strokeWidth={20}
        showInfo={false}
        strokeLinecap="square"
      />
    </>
  );
};
