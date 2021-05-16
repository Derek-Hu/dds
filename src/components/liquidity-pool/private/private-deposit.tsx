import { Component } from 'react';
import { Tabs, Button, Row, Col, Select, Input, Alert, Descriptions } from 'antd';
import styles from '../style.module.less';
import { isGreaterZero } from '../../../util/math';
import commonStyles from '../../funding-balance/modals/style.module.less';
// import AvailablePoolUnlogin from './private/available-pool-unlogin';
import { CoinSelectOption } from '../../../constant/index';
import ModalRender from '../../modal-render/index';
import { doPrivateDeposit } from '../../../services/pool.service';
import Auth, { Public } from '../../builtin/auth';
import InputNumber from '../../input/index';
import SiteContext from '../../../layouts/SiteContext';

const { Option } = Select;
interface IState {
  modalVisible: boolean;
  selectedCoin: IUSDCoins;
  amount: number | undefined;
}

interface IProps {}
type TModalKeys = Pick<IState, 'modalVisible'>;

export default class LiquidityProvided extends Component<IProps, IState> {
  state: IState = {
    modalVisible: false,
    selectedCoin: 'DAI',
    amount: undefined,
  };

  static contextType = SiteContext;

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: () => {
        const { amount } = this.state;
        if (!isGreaterZero(amount)) {
          return;
        }
        this.setState({
          [key]: true,
        });
      },

      hide: () =>
        this.setState({
          [key]: false,
        }),
    };
  };

  modalVisible = this.setModalVisible('modalVisible');

  onSelectChange = (selectedCoin: any) => {
    this.setState({
      selectedCoin,
    });
  };

  confirmPrivateDeposit = async () => {
    this.modalVisible.hide();
    const { amount, selectedCoin } = this.state;
    // @ts-ignore
    const success = await doPrivateDeposit({ amount: parseFloat(amount), coin: selectedCoin });
    if (success) {
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  onAmountChange = (amount: number) => {
    this.setState({
      amount,
    });
  };

  render() {
    const { selectedCoin, amount } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <Auth>
            <Alert
              className={styles.poolMsg}
              message="Note: private pool is targeting professional investor and market maker, please be aware of risk before you proceed."
              type="warning"
            />
            <div className={[styles.actionArea, styles.privateArea].join(' ')}>
              <Row gutter={[isMobile ? 12 : 12, isMobile ? 15 : 0]}>
                <Col xs={8} sm={8} md={8} lg={6}>
                  <Select
                    defaultValue={selectedCoin}
                    style={{ width: '100%', height: 50 }}
                    className={styles.coinDropdown}
                    onChange={this.onSelectChange}
                  >
                    {/* {CoinSelectOption} */}
                    <Option value="DAI">DAI</Option>
                  </Select>
                </Col>
                <Col xs={16} sm={16} md={16} lg={18}>
                  <InputNumber min={1} onChange={this.onAmountChange} placeholder="Min amount: 1 DAI" />
                </Col>
              </Row>
              <Button type="primary" className={styles.btn} onClick={this.modalVisible.show}>
                DEPOSIT
              </Button>
            </div>

            <ModalRender
              visible={this.state.modalVisible}
              title="Comfirm Deposit"
              className={commonStyles.commonModal}
              onCancel={this.modalVisible.hide}
              height={300}
              footer={null}
            >
              <Descriptions column={1} colon={false}>
                <Descriptions.Item label="Amount">
                  {amount} {selectedCoin}
                </Descriptions.Item>
              </Descriptions>
              <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button onClick={this.modalVisible.hide}>CANCEL</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button onClick={this.confirmPrivateDeposit} type="primary">
                    CONFIRM
                  </Button>
                </Col>
              </Row>
            </ModalRender>
          </Auth>
        )}
      </SiteContext.Consumer>
    );
  }
}
