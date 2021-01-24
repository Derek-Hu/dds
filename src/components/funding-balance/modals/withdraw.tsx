import { Tabs, Button, Row, Col, Select, Input } from "antd";
import { CustomTabKey, SupportedCoins } from "../../../constant/index";
import styles from "./style.module.less";
import ModalRender from "../../modal-render/index";

const { Option } = Select;

const title = "Funding Withdraw";

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender visible={visible} onCancel={onCancel} footer={null}>
      <h4>{title}</h4>
      <Row>
        <Col>
          <Select defaultValue="DAI" style={{ width: 120, height: 50 }}>
            {SupportedCoins.map((coin) => (
              <Option value={coin}>{coin}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <span className={styles.maxWithdraw}>
            Max Withdraw Balance: <span>3278392</span> DAI
          </span>
        </Col>
      </Row>
      <Row className={styles.repay}>
        <Col>
          <Input placeholder="Withdraw amount" />
        </Col>
        <Col>
          <p>XXX reDAI you need to pay</p>
        </Col>
      </Row>
      <Row>
          <Col>
            <Button>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary">Claim</Button>
          </Col>
        </Row>
    </ModalRender>
  );
};
