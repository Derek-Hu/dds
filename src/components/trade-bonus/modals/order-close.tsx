import { Form, Button, Row, Col, Select, Descriptions } from 'antd';
import styles from '../../funding-balance/modals/style.module.less';
import currStyles from './style.module.less';
import ModalRender from '../../modal-render/index';
import SiteContext from '../../../layouts/SiteContext';

const title = 'Close Order';

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <ModalRender
          visible={visible}
          onCancel={onCancel}
          height={320}
          footer={null}
          title={title}
          className={styles.commonModal}
        >
          <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
            <Descriptions.Item label="Type" span={24}>
              LONG
            </Descriptions.Item>
            <Descriptions.Item label="Open Price" span={24}>
              644.05 DAI
            </Descriptions.Item>
            <Descriptions.Item label="Amount" span={24}>
              10 ETH
            </Descriptions.Item>
            <Descriptions.Item label="Close Price" span={24}>
              905 DAI
            </Descriptions.Item>
            <Descriptions.Item label="P&L" span={24}>
              5 DAI (+15%)
            </Descriptions.Item>
          </Descriptions>
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
  );
};
