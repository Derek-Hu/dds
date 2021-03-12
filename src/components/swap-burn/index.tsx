import { Component } from 'react';
import SwapBar from './swap-bar';
import styles from './style.module.less';
import { Button, Select, Form, Icon, Input, Row, Col, Descriptions } from 'antd';
import numeral from 'numeral';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { CoinSelectOption } from '../../constant/index';
import { Visible, Hidden } from '../builtin/hidden';
import Auth, { Public } from '../builtin/auth';
import { getSwapPrice } from '../../services/swap-burn.service';
import { format } from '../../util/math';

const { Option } = Select;

const swapInfo = {
  dds: 1078,
  coin: 4.46,
  unit: 'DAI',
};

interface IState {
  loading: boolean;
  data?: ISwapBurn;
  swapModalVisible: boolean;
}

export default class PoolArea extends Component<{ isLogin: boolean }, IState> {
  state: IState = {
    swapModalVisible: false,
    loading: false,
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

  closeSwapModal = () => {
    this.setState({
      swapModalVisible: false,
    });
  };

  showSwapModal = () => {
    this.setState({
      swapModalVisible: true,
    });
  };

  render() {
    const { loading, data } = this.state;
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
                                className={styles.ddsInput}
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
                                    defaultValue="DAI"
                                    className={styles.coinDropdown}
                                    style={{ width: '100%', height: 50 }}
                                  >
                                    {CoinSelectOption}
                                  </Select>
                                </Col>
                                <Col xs={11} sm={11} md={13} lg={13}>
                                  <Input placeholder="" />
                                </Col>
                              </Row>
                            </Col>
                            <Col span={4}>
                              <span className={styles.targetUnit}>DAI</span>
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item className={styles.lastRow}>
                          <Button type="primary" onClick={this.showSwapModal}>
                            Swap
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Auth>
                </div>
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
                      1DDS : 644.05 DAI
                    </Descriptions.Item>
                    <Descriptions.Item label="Swap Amount" span={24}>
                      10 DDS
                    </Descriptions.Item>
                    <Descriptions.Item label="Receive" span={24}>
                      6440.5 DAI
                    </Descriptions.Item>
                  </Descriptions>
                  <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                    <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                      <Button>Cancel</Button>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                      <Button type="primary">Comfirm</Button>
                    </Col>
                  </Row>
                </ModalRender>
              </div>
            </Hidden>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
