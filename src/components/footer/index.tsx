import { Row, Col } from "antd";
import styles from "./style.module.less";

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Row>
          <Col span={8} className={styles.left}>
            <h2>DDerivatives</h2>
            <p>Infrastructure for future derivatives</p>
          </Col>
          <Col span={16} className={styles.right}>
            
          </Col>
        </Row>
      </div>
    </div>
  );
};
