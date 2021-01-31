import { Descriptions, Row, Col, Button, Divider } from "antd";
import styles from "./style.module.less";
import ModalRender from "../../modal-render/index";
import SiteContext from "../../../layouts/SiteContext";

const title = "Order Confirm";

export default (props: any) => {
  const { visible, onCancel } = props;
  const invitor = "Invitor:www.dderivatives.com"

  return <SiteContext.Consumer>
  {({ isMobile }) => (
    <ModalRender
      visible={visible}
      height={invitor ? 475: 390}
      onCancel={onCancel}
      footer={null}
      title={title}
      className={styles.commonModal}
    >
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
      {invitor ? (
        <>
          <Divider />
          <p className={styles.invitorInfo}>{invitor}</p>
        </>
      ) : null}

      <Row gutter={[isMobile ? 0: 16, 16]} className={styles.actionBtns} type="flex">
        <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
          <Button>Cancel</Button>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
          <Button type="primary">Confirm</Button>
        </Col>
      </Row>
    </ModalRender>
  )}
  </SiteContext.Consumer>
};
