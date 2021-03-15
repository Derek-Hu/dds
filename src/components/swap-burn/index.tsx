import { Component } from 'react';
import SwapBar from './swap-bar';
import styles from './style.module.less';
import { Button, Select, Form, Icon, Input, Row, Col, Descriptions, message } from 'antd';
import numeral from 'numeral';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { CoinSelectOption } from '../../constant/index';
import { Visible, Hidden } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import { getSwapPrice, conformSwap } from '../../services/swap-burn.service';
import { format, isNotZeroLike } from '../../util/math';

interface IState {
  loading: boolean;
  data?: ISwapBurn;
  swapModalVisible: boolean;
  selectedCoin: IUSDCoins;
  amount?: string;
}

export default class PoolArea extends Component<{ isLogin: boolean }, IState> {
  state: IState = {
    swapModalVisible: false,
    loading: false,
    selectedCoin: 'DAI',
  };

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

  onAmountChange = (e: any) => {
    this.setState({
      amount: e.target.value,
    });
  };

  closeSwapModal = () => {
    this.setState({
      swapModalVisible: false,
    });
  };

  showSwapModal = () => {
    if (!isNotZeroLike(this.state.amount)) {
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
    await conformSwap({
      coin: selectedCoin,
      amount,
    });
  };

  render() {
    const { loading, data, selectedCoin, amount } = this.state;
    const transfed = Number(amount) * data?.rate!;
    const transferText = isNaN(transfed) ? '' : format(transfed);
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => {
          return (
            <Hidden when={loading}>
              <div className={styles.root}>
                <h1>Swap & burn</h1>
                <div className={styles.card}>
                  <div className={styles.imgBar}>
                    <SwapBar leftAmount={format(data?.usd)} rightAmount={format(data?.dds)}></SwapBar>
                  </div>
                  <h3 className={styles.msg}>Current Swap Price</h3>
                  <p className={styles.calcute}>1 DDS = {format(data?.rate)} USD</p>
                  <Auth>
                    <div className={styles.swapContainer}>
                      <Form className="login-form">
                        <Form.Item>
                          <Row>
                            <Col xs={20} sm={20} md={20} lg={20}>
                              <Input
                                value={amount}
                                className={styles.ddsInput}
                                onChange={this.onAmountChange}
                                placeholder="How many DDS do you want to swap and burn?"
                              />
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                              <span className={styles.unit}>DDS</span>
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item>
                          <Row>
                            <Col span={20}>
                              <Row gutter={12}>
                                <Col xs={3} sm={3} md={3} lg={3}>
                                  <span className={styles.swap}>
                                    <Icon type="swap" />
                                  </span>
                                </Col>
                                <Col xs={10} sm={10} md={8} lg={8}>
                                  <Select
                                    defaultValue={selectedCoin}
                                    className={styles.coinDropdown}
                                    style={{ width: '100%', height: 50 }}
                                  >
                                    {CoinSelectOption}
                                  </Select>
                                </Col>
                                <Col xs={11} sm={11} md={13} lg={13}>
                                  <Input value={transferText} readOnly={true} placeholder="" />
                                </Col>
                              </Row>
                            </Col>
                            <Col span={4}>
                              <span className={styles.targetUnit}>DAI</span>
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item className={styles.lastRow}>
                          <Row>
                            <Col xs={20} sm={20} md={20} lg={20}>
                              <Button type="primary" onClick={this.showSwapModal}>
                                Swap
                              </Button>
                            </Col>
                          </Row>
                        </Form.Item>
                      </Form>
                    </div>
                  </Auth>
                  <ModalRender
                    visible={this.state.swapModalVisible}
                    title="Order Comfirm"
                    height={330}
                    className={commonStyles.commonModal}
                    onCancel={this.closeSwapModal}
                    footer={null}
                  >
                    <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                      <Descriptions.Item label="Swap Ratio" span={24}>
                        1DDS : {format(data?.rate)} DAI
                      </Descriptions.Item>
                      <Descriptions.Item label="Swap Amount" span={24}>
                        {amount} DDS
                      </Descriptions.Item>
                      <Descriptions.Item label="Receive" span={24}>
                        {transferText} {selectedCoin}
                      </Descriptions.Item>
                    </Descriptions>
                    <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                      <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                        <Button>Cancel</Button>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                        <Button onClick={this.conformSwap} type="primary">
                          Comfirm
                        </Button>
                      </Col>
                    </Row>
                  </ModalRender>
                </div>
              </div>
            </Hidden>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
