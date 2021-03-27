import { Tag, Button, Row, Col, Select, Input } from 'antd';
import ModalRender from '../../modal-render/index';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import { format, isGreaterZero } from '../../../util/math';
import InputNumber from '../../input/index';

const title = 'Funding Fee Deposit';

interface IProps {
  visible: boolean;
  onCancel: () => any;
  max?: number;
  coin: string;
  onConfirm: (depositAmount?: number) => any;
}
interface IState {
  depositAmount?: number;
}
export default class Balance extends Component<IProps, IState> {
  state: IState = {};

  onAmountChange = (depositAmount: number) => {
    this.setState({
      depositAmount,
    });
  };

  render() {
    const { visible, onCancel, onConfirm, max, coin } = this.props;
    const { depositAmount } = this.state;
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
                <Col xs={24} sm={24} md={24} lg={24}>
                  <InputNumber
                    className={styles.orderInput}
                    onChange={this.onAmountChange}
                    placeholder={max ? `Max ${max}` : '0.00'}
                    max={max}
                    showTag={true}
                    // tagClassName={styles.utilMax}
                    suffix={coin}
                  />
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]} className={styles.utilMax} type="flex" justify="space-between">
              <Col span={12}>
                <Tag color="#1346FF">Max</Tag>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                323.34 ETH
              </Col>
            </Row> */}
              <Row className={styles.actionBtns} gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button onClick={onCancel}>CANCEL</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button
                    onClick={() => {
                      if (!isGreaterZero(depositAmount)) {
                        return;
                      }
                      onConfirm(depositAmount);
                    }}
                    type="primary"
                  >
                    DEPOSIT
                  </Button>
                </Col>
              </Row>
            </div>
          </ModalRender>
        )}
      </SiteContext.Consumer>
    );
  }
}
