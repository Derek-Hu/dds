import { Tabs, Button, Row, Col, Select, Input } from 'antd';
import { SupportedCoins } from '../../../constant/index';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';

const { Option } = Select;

const title = 'Unlock reTokens';

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
            Maximum Amount: <span>3278392</span> reDAI
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
          <Button>CANCEL</Button>
        </Col>
        <Col>
          <Button type="primary">CONFIRM</Button>
        </Col>
      </Row>
    </ModalRender>
  );
};
