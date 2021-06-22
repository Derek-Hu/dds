import { Tabs, Button, Row, Col, Select, Input, Tag } from 'antd';
import { CustomTabKey, SupportedCoins } from '../../../constant/index';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
// import { CoinSelectOption } from '../../../constant/index';
import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import { format, isGreaterZero } from '../../../util/math';
import InputNumber from '../../input/index';
import { formatMessage } from 'util/i18n';

const title = formatMessage({ id: 'funding-fee-withdraw' });

interface IProps {
  visible: boolean;
  onCancel: () => any;
  onConfirm: (amount: number, coin: IUSDCoins) => any;
  max?: number;
  coin: IUSDCoins;
}
interface IState {
  amount?: number;
  selectedCoin: IUSDCoins;
}
export default class Balance extends Component<IProps, IState> {
  state: IState = {
    selectedCoin: this.props.coin,
  };

  onAmountChange = (amount: number) => {
    this.setState({
      amount,
    });
  };

  onMaxOpenClick = () => {
    const { max } = this.props;
    this.setState({
      amount: max,
    });
  };

  onCoinChange = (selectedCoin: IUSDCoins) => {
    this.setState({
      selectedCoin,
    });
  };

  render() {
    const { visible, onCancel, onConfirm, max, coin } = this.props;
    const { amount, selectedCoin } = this.state;

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
              {/* <Col xs={24} sm={24} md={6} lg={6}>
                <Select defaultValue={coin} disabled={true} onChange={this.onCoinChange} style={{ width: '100%', height: 50 }}>
                  {CoinSelectOption}
                </Select>
              </Col> */}
              <Col span={24}>
                <InputNumber
                  className={styles.orderInput}
                  onChange={this.onAmountChange}
                  placeholder={max ? `${formatMessage({ id: 'max' })} ${max}` : '0.00'}
                  max={max}
                  showTag={true}
                  // tagClassName={styles.utilMax}
                  suffix={coin}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className={styles.actionBtns} style={{ paddingTop: '8px' }} type="flex">
              <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                <Button onClick={onCancel}>{formatMessage({ id: 'cancel' })}</Button>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                <Button
                  type="primary"
                  onClick={() => {
                    if (!isGreaterZero(amount)) {
                      return;
                    }
                    onConfirm(amount!, coin);
                  }}
                >
                  {formatMessage({ id: 'withdraw' })}
                </Button>
              </Col>
            </Row>
          </ModalRender>
        )}
      </SiteContext.Consumer>
    );
  }
}
