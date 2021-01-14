import { Row, Col } from "antd";
import styles from "./pool.module.less";
import numeral from "numeral";

export interface IPool {
  title: string;
  usd: number;
  coins: Array<{ name: string; value: number }>;
  children?: React.ReactElement | React.ReactElement[];
  smallSize?: boolean;
}
export default (props: IPool) => {
  const { title, usd, coins, children, smallSize } = props;
  return (
    <div className={[styles.root, smallSize ?styles.small:''].join(' ')}>
      <h4>{title}</h4>
      <p className={styles.numbers}>
        {numeral(usd).format("0,0")} <span>USD</span>
      </p>
      <Row>
        {coins.map(({ name, value }) => (
          <Col key={name} span={8}>
            <p className={styles.coinName}>{name}</p>
            <span>{value}</span>
          </Col>
        ))}
      </Row>
      {
        children
      }
    </div>
  );
};
