import { Descriptions, Row, Col, Button } from "antd";
import styles from "./style.module.less";
import ModalRender from "../../modal-render/index";

const title = "Order Confirm";

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender visible={visible} onCancel={onCancel} footer={null}>
      <h4>{title}</h4>
      <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
        <Descriptions.Item label="Type" span={24}>
          Long
        </Descriptions.Item>
        <Descriptions.Item label="Open Price" span={24}>
          644.05 DAI
        </Descriptions.Item>
        <Descriptions.Item label="Amount" span={24}>
          10 ETH
        </Descriptions.Item>
        <Descriptions.Item label="Funding Locked" span={24}>
          0.02 DAI
        </Descriptions.Item>
        <Descriptions.Item label="Settlements Fee" span={24}>
          0.644 DAI
        </Descriptions.Item>
      </Descriptions>
      <p>Invitor:www.dderivatives.com</p>
      <Row>
        <Col>
          <Button>Cancel</Button>
        </Col>
        <Col>
          <Button type="primary">Confirm</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
