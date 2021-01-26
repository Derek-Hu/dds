import { Tabs, Button, Row, Col, Select, Input } from "antd";
import { CustomTabKey, SupportedCoins } from "../../../constant/index";
import styles from "./style.module.less";
import ModalRender from "../../modal-render/index";

const { Option } = Select;

const title = "Funding Withdraw";

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender
      visible={visible}
      onCancel={onCancel}
      footer={null}
      className={styles.commonModal}
    >
      <h4>{title}</h4>
      <Row gutter={16} type="flex" justify="space-between" align="middle">
        <Col xs={24} sm={24} md={6} lg={6}>
          <Select defaultValue="DAI" style={{ width: '100%', height: 50 }}>
            {SupportedCoins.map((coin) => (
              <Option value={coin}>{coin}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={18} lg={18}>
          <span className={styles.maxWithdraw}>
            Max Withdraw Balance: <span>3278392</span> DAI
          </span>
        </Col>
      </Row>
      <Row className={styles.repay}>
        <Col>
          <Input placeholder="Withdraw amount" />
        </Col>
        {/* <Col>
          <p>XXX reDAI you need to pay</p>
        </Col> */}
      </Row>
      <Row gutter={16} className={styles.actionBtns}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Button>Cancel</Button>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Button type="primary">Claim</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
