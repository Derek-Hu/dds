import { Descriptions, Row, Col, Button } from 'antd';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
import SiteContext from '../../../layouts/SiteContext';

const title = 'Order Confirm';

interface IProps {
  visible: boolean;
  onCancel: () => any;
  onConfirm: () => any;
  fees?: IOpenFee;
  data: {
    type?: ITradeType;
    amount?: any;
    coins: { from: IFromCoins; to: IUSDCoins };
  };
}

export default ({ fees, data: { type, amount, coins }, visible, onCancel, onConfirm }: IProps) => {
  const { from, to } = coins;

  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <ModalRender
          visible={visible}
          height={390}
          onCancel={onCancel}
          footer={null}
          title={title}
          className={styles.commonModal}
        >
          <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
            <Descriptions.Item label="Type" span={24}>
              {type}
            </Descriptions.Item>
            <Descriptions.Item label="Open Price" span={24}>
              {fees?.curPrice} {to}
            </Descriptions.Item>
            <Descriptions.Item label="Amount" span={24}>
              {amount} {from}
            </Descriptions.Item>
            <Descriptions.Item label="Funding Fee Locked" span={24}>
              {fees?.fundingFeeLocked} {to}
            </Descriptions.Item>
            <Descriptions.Item label="Settlement Fee" span={24}>
              {fees?.settlementFee} {to}
            </Descriptions.Item>
          </Descriptions>
          <Row gutter={[isMobile ? 0 : 16, 16]} className={styles.actionBtns} type="flex">
            <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
              <Button onClick={onCancel}>CANCEL</Button>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
              <Button onClick={onConfirm} type="primary">
                CONFIRM
              </Button>
            </Col>
          </Row>
        </ModalRender>
      )}
    </SiteContext.Consumer>
  );
};
