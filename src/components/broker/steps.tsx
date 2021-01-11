import { Icon, Row, Col } from "antd";
import styles from "./style.module.less";

export default () => {
  return (
    <div className={styles.steps}>
      <h4>Simple Steps</h4>
      <Row>
        <Col span={8}>
          <Icon type="form" />
          <p>1. Invite Friends</p>
          <div>
            Invite friends to DDerivatives through the referral link or
            invitation code
          </div>
        </Col>
        <Col span={8}>
          <Icon type="line-chart" />
          <p>2. Your Friends Open First Order</p>
          <div>
            Invite friends to DDerivatives through the referral link or
            invitation code
          </div>
        </Col>
        <Col span={8}>
          <Icon type="fund" />
          <p>3. Receive Your DDS Bonus</p>
          <div>Instantly get your bonus as DDS</div>
        </Col>
      </Row>
    </div>
  );
};
