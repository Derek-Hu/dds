import { Button } from "antd";
import styles from "./style.module.less";

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h2>The world's first <br/>Decentralized Non-Risk Perpetual Exchange</h2>
        <Button className={styles.spot}>Spot Trading</Button>
        <Button className={styles.read} type="link">Read the docs</Button>
      </div>
    </div>
  );
};
