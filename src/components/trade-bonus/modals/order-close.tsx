import { Form, Button, Row, Col, Select, Input } from "antd";
import styles from "../../funding-balance/modals/style.module.less";
import ModalRender from "../../modal-render/index";

const title = "Close Order";

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
      <Row type="flex" justify="space-between" align="middle">
        <Col xs={20} sm={20} md={20} lg={20}>
          <Input
            className={styles.ddsInput}
            placeholder="How many DDS do you want to swap and burn?"
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4} style={{    textAlign: 'center'}}>
          <span className={styles.unit}>DDS</span>
        </Col>
      </Row>
      <p>
        Total Amount: 10.36 <Button type="link">Close All</Button>
      </p>
      <Row className={styles.actionBtns} gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Button>Cancel</Button>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Button type="primary">Close</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
