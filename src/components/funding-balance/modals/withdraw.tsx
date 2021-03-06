import { Tabs, Button, Row, Col, Select, Input } from 'antd';
import { CustomTabKey, SupportedCoins } from '../../../constant/index';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
import { CoinSelectOption } from '../../../constant/index';
import SiteContext from '../../../layouts/SiteContext';

const { Option } = Select;

const title = 'Funding Withdraw';

export default (props: any) => {
  const { visible, onCancel, maxWithdraw, onWithdraw, onAmountChange } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <ModalRender
          visible={visible}
          onCancel={onCancel}
          footer={null}
          height={375}
          title={title}
          className={styles.commonModal}
        >
          <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
            <Col xs={24} sm={24} md={6} lg={6}>
              <Select defaultValue="DAI" style={{ width: '100%', height: 50 }}>
                {CoinSelectOption}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18}>
              <span className={styles.maxWithdraw} style={{ marginLeft: 0 }}>
                Max Withdraw Balance: <span>{maxWithdraw}</span> DAI
              </span>
            </Col>
            <Col span={24}>
              <Input onChange={onAmountChange} placeholder="Withdraw amount" />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className={styles.actionBtns} style={{ paddingTop: '8px' }} type="flex">
            <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
              <Button onClick={onCancel}>Cancel</Button>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
              <Button type="primary" onClick={onWithdraw}>
                Withdraw
              </Button>
            </Col>
          </Row>
        </ModalRender>
      )}
    </SiteContext.Consumer>
  );
};
