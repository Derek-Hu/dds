import { Form, Button, Row, Col, Select, Input } from "antd";
import styles from "../../funding-balance/modals/style.module.less";
import currStyles from "./style.module.less";
import ModalRender from "../../modal-render/index";
import SiteContext from "../../../layouts/SiteContext";

const title = "Close Order";

export default (props: any) => {
  const { visible, onCancel } = props;
  return <SiteContext.Consumer>
  {({ isMobile }) => (
    <ModalRender
      visible={visible}
      onCancel={onCancel}
      height={320}
      footer={null}
      title={title}
      className={styles.commonModal}
    >
      <Row type="flex" justify="space-between" align="middle">
        <Col xs={20} sm={20} md={20} lg={20}>
          <Input
            placeholder="How many DDS do you want to swap and burn?"
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4} style={{    textAlign: 'center'}}>
          <span>DDS</span>
        </Col>
      </Row>
      <p className={currStyles.tips}>
        Total Amount: 10.36 <Button type="link">Close All</Button>
      </p>
      <Row className={styles.actionBtns} gutter={[16, 16]} type="flex">
        <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
          <Button>Cancel</Button>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
          <Button type="primary">Close</Button>
        </Col>
      </Row>
    </ModalRender>
  )}
  </SiteContext.Consumer>
};
