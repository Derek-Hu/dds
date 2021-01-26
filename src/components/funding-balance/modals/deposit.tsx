import { Tabs, Button, Row, Col, Select, Input } from "antd";
import ModalRender from "../../modal-render/index";
import styles from "./style.module.less";

const { Option } = Select;

const title = "Funding Deposit";

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender visible={visible} onCancel={onCancel} footer={null} className={styles.commonModal}>
      <div>
        <h4>{title}</h4>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Select defaultValue="lucy" style={{ width: '100%', height: 50 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Input placeholder="Deposit amount" />
          </Col>
        </Row>
        <Row className={styles.actionBtns} gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Button>Cancel</Button>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Button type="primary">Go to deposit</Button>
          </Col>
        </Row>
      </div>
    </ModalRender>
  );
};
