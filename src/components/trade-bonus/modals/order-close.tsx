import { Form, Button, Row, Col, Select, Input } from "antd";
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
        <Form.Item>
          <Input
            className={styles.ddsInput}
            placeholder="How many DDS do you want to swap and burn?"
          />
          <span className={styles.unit}>DDS</span>
        </Form.Item>
      </Row>
      <p>Total Amount: 10.36 <Button type="link">Close All</Button></p>
      <Row>
        <Col>
          <Button>Cancel</Button>
        </Col>
        <Col>
          <Button type="primary">Close</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
