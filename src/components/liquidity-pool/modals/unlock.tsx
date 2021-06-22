import { Tabs, Button, Row, Col, Select, Input } from 'antd';
import { CustomTabKey, SupportedCoins } from '../../../constant/index';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
import { formatMessage } from 'util/i18n';

const { Option } = Select;

const title = formatMessage({ id: 'unlock-retokens' });

export default (props: any) => {
  const { visible, onCancel } = props;
  return (
    <ModalRender title={title} visible={visible} onCancel={onCancel} footer={null}>
      <Row>
        <Col>
          <Select defaultValue="DAI" style={{ width: 120, height: 50 }}>
            {SupportedCoins.map(coin => (
              <Option value={coin}>{coin}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <span className={styles.maxWithdraw}>
            {formatMessage({ id: 'maximum-amount-amount-redai', amount: 3278392 })}
          </span>
        </Col>
      </Row>
      <Row className={styles.repay}>
        <Col>
          <Input placeholder="Amount for unlocking" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button>{formatMessage({ id: 'cancel' })}</Button>
        </Col>
        <Col>
          <Button type="primary">{formatMessage({ id: 'confirm' })}</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
