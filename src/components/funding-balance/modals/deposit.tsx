import { Tabs, Button, Row, Col, Select, Input } from "antd";
import ModalRender from "../../modal-render/index";

const { Option } = Select;

const title = "Funding Deposit";

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender visible={visible} onCancel={onCancel} footer={null}>
      <div>
        <h4>{title}</h4>
        <Row>
          <Col>
            {" "}
            <Select defaultValue="lucy" style={{ width: 120, height: 50 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col>
            <Input placeholder="Deposit amount" />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary">Go to deposit</Button>
          </Col>
        </Row>
      </div>
    </ModalRender>
  );
};
