import { Tag, Button, Row, Col, Select, Input } from "antd";
import ModalRender from "../../modal-render/index";
import styles from "./style.module.less";
import SiteContext from "../../../layouts/SiteContext";
import { CoinSelectOption } from '../../../constant/index';

const title = 'Funding Deposit';

export default (props: any) => {
  const { visible, onCancel, onDeposit, onAmountChange } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <ModalRender
          visible={visible}
          onCancel={onCancel}
          footer={null}
          height={340}
          title={title}
          className={styles.commonModal}
        >
          <div>
            {/* <h4>{title}</h4> */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={18} lg={18}>
                <Input placeholder="Deposit amount" onChange={onAmountChange} />
              </Col>
            </Row>
            <Row  gutter={[16, 16]} className={styles.utilMax} type="flex" justify="space-between">
              <Col span={12}><Tag color="#1346FF">Max</Tag></Col>
              <Col span={12} style={{textAlign: 'right'}}>323.34 ETH</Col>
            </Row>
            <Row className={styles.actionBtns} gutter={[16, 16]} type="flex">
              <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                <Button onClick={onCancel}>Cancel</Button>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                <Button onClick={onDeposit} type="primary">
                  Deposit
                </Button>
              </Col>
            </Row>
          </div>
        </ModalRender>
      )}
    </SiteContext.Consumer>
  );
};
