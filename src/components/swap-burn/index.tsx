import { Component } from 'react';
import SwapBar from './swap-bar';
import styles from './style.module.less';
import { Button, Select, Form, Icon, Input, Row, Col, Descriptions } from 'antd';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
// import { CoinSelectOption } from '../../constant/index';
import { Hidden } from '../builtin/hidden';
import Auth from '../builtin/auth';
import { getSwapPrice, conformSwap } from '../../services/swap-burn.service';
import { format, multiple, formatInt, isGreaterZero } from '../../util/math';
import Placeholder from '../placeholder/index';
import InputNumber from '../input/index';
import { formatMessage } from 'locale/i18n';

const { Option } = Select;
interface IState {
  loading: boolean;
  data?: ISwapBurn;
  swapModalVisible: boolean;
  selectedCoin: IUSDCoins;
  amount?: number;
}

export default class PoolArea extends Component<any, IState> {
  state: IState = {
    swapModalVisible: false,
    loading: false,
    selectedCoin: 'DAI',
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const data = await getSwapPrice();
      this.setState({
        data,
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  onCoinChange = (selectedCoin: IUSDCoins) => {
    this.setState({
      selectedCoin,
    });
  };

  onAmountChange = (amount: number) => {
    this.setState({
      amount,
    });
  };

  closeSwapModal = () => {
    this.setState({
      swapModalVisible: false,
    });
  };

  showSwapModal = () => {
    if (!isGreaterZero(this.state.amount)) {
      // message.warning('')
      return;
    }
    this.setState({
      swapModalVisible: true,
    });
  };

  conformSwap = async () => {
    this.closeSwapModal();
    const { selectedCoin, amount } = this.state;
    const success = await conformSwap({
      coin: selectedCoin,
      amount: Number(amount),
    });
    if (success) {
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  render() {
    const { loading, data, selectedCoin, amount } = this.state;
    const transfed = multiple(amount, data?.rate, true);
    const transferText = isNaN(transfed) ? '' : transfed.toFixed(2);
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => {
          return (
            <div className={styles.root}>
              <h2>{formatMessage({ id: 'menu-swap-burn' })}</h2>
              <div className={styles.card}>
                <div className={styles.imgBar}>
                  <SwapBar
                    loading={loading}
                    leftAmount={formatInt(data?.usd)}
                    rightAmount={formatInt(data?.dds)}
                  ></SwapBar>
                </div>
                <h3 className={styles.msg}>{formatMessage({ id: 'current-swap-price' })}</h3>
                <p className={styles.calcute}>
                  <Placeholder width={'10em'} loading={loading}>
                    1 SLD = {format(data?.rate)} USD
                  </Placeholder>
                </p>
                <Hidden when={loading}>
                  <Auth>
                    <div className={styles.swapContainer}>
                      <Form className="login-form">
                        <Form.Item>
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <InputNumber
                                delay={false}
                                className={styles.ddsInput}
                                onChange={this.onAmountChange}
                                placeholder={formatMessage({ id: 'amount' })}
                              />
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item>
                          <Row>
                            <Col span={24}>
                              <Row gutter={12}>
                                <Col xs={3} sm={3} md={3} lg={3}>
                                  <span className={styles.swap}>
                                    <Icon type="swap" />
                                  </span>
                                </Col>
                                <Col xs={10} sm={10} md={8} lg={8}>
                                  <Select
                                    value={selectedCoin}
                                    className={styles.coinDropdown}
                                    onChange={this.onCoinChange}
                                    style={{ width: '100%', height: 50 }}
                                  >
                                    <Option value="DAI">DAI</Option>
                                    {/* {CoinSelectOption} */}
                                  </Select>
                                </Col>
                                <Col xs={11} sm={11} md={13} lg={13}>
                                  <Input value={transferText} readOnly={true} placeholder="" suffix="DAI" />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item className={styles.lastRow}>
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <Button type="primary" onClick={this.showSwapModal}>
                                {formatMessage({ id: 'swap' })}
                              </Button>
                            </Col>
                          </Row>
                        </Form.Item>
                      </Form>
                    </div>
                  </Auth>
                  <ModalRender
                    visible={this.state.swapModalVisible}
                    title={formatMessage({ id: 'order-confirm' })}
                    height={330}
                    className={commonStyles.commonModal}
                    onCancel={this.closeSwapModal}
                    footer={null}
                  >
                    <Descriptions column={1} colon={false}>
                      <Descriptions.Item label="Swap Ratio">1SLD : {format(data?.rate)} USD</Descriptions.Item>
                      <Descriptions.Item label="Swap Amount">{format(amount)} SLD</Descriptions.Item>
                      <Descriptions.Item label="Receive">
                        {transferText} {selectedCoin}
                      </Descriptions.Item>
                    </Descriptions>
                    <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                      <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                        <Button onClick={this.closeSwapModal}>{formatMessage({ id: 'cancel' })}</Button>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                        <Button onClick={this.conformSwap} type="primary">
                          {formatMessage({ id: 'confirm' })}
                        </Button>
                      </Col>
                    </Row>
                  </ModalRender>
                </Hidden>
              </div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
