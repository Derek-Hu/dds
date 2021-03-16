import { CustomTabKey, CoinSelectOption } from '../../../constant/index';
import { Tabs, Button, Row, Col, Select, Input, Alert, Descriptions } from 'antd';
import styles from '../style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import { format, isNotZeroLike, isNumberLike } from '../../../util/math';
import { getCollaborativeArp } from '../../../services/pool.service';
import ModalRender from '../../modal-render/index';
import commonStyles from '../../funding-balance/modals/style.module.less';
import { getCollaborativeDepositRe, doCollaborativeDeposit } from '../../../services/pool.service';
import Auth from '../../builtin/auth';
import { Hidden } from '../../builtin/hidden';

interface IState {
  data: number | '';
  loading: boolean;
  modalVisible: boolean;
  selectedCoin: IUSDCoins;
  amount: number | undefined;
  reAmount: number | undefined;
}

interface IProps {}
type TModalKeys = Pick<IState, 'modalVisible'>;

export default class LiquidityProvided extends Component<IProps, IState> {
  state: IState = {
    data: '',
    loading: false,
    modalVisible: false,
    selectedCoin: 'DAI',
    amount: undefined,
    reAmount: undefined,
  };

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: () =>{
        const { amount } = this.state;
        if(!isNotZeroLike(amount)){
          return;
        }
        this.setState({
          [key]: true,
        })
      },

      hide: () =>
        this.setState({
          [key]: false,
        }),
    };
  };

  modalVisible = this.setModalVisible('modalVisible');

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const data = await getCollaborativeArp();
      this.setState({
        data,
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  onSelectChange = (selectedCoin: any) => {
    const { amount } = this.state;
    this.setState({
      selectedCoin,
    });
    // @ts-ignore
    this.calculateRe({ amount, coin: selectedCoin });
  };

  onAmountChange = (e: any) => {
    const { selectedCoin } = this.state;
    const val = e.target.value;
    this.setState({
      amount: val,
    });
    this.calculateRe({ coin: selectedCoin, amount: val });
  };

  confirmDeposit = async () => {
    const { amount, selectedCoin } = this.state;
    this.modalVisible.hide();
    await doCollaborativeDeposit({ amount: amount!, coin: selectedCoin });
  };

  calculateRe = async ({ amount, coin }: { amount: number | string; coin: IUSDCoins }) => {
    if (amount === '' || amount === null || amount === undefined) {
      return 0;
    }

    // @ts-ignore
    const reAmount = await getCollaborativeDepositRe({ amount, coin });
    this.setState({
      reAmount,
    });
  };
  render() {
    const { data, modalVisible, loading, amount, selectedCoin, reAmount } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <Hidden when={loading}>
              <div>
                <h3>ARP</h3>
                <p className={styles.coins}>{isNumberLike(data)? `${data}%` : 'N/A'}</p>
                <Auth>
                  <div className={styles.actionArea}>
                    <Row gutter={[isMobile ? 0 : 12, isMobile ? 15 : 0]}>
                      <Col xs={24} sm={24} md={8} lg={6}>
                        <Select
                          value={selectedCoin}
                          style={{ width: '100%', height: 50 }}
                          className={styles.coinDropdown}
                          onChange={this.onSelectChange}
                        >
                          {CoinSelectOption}
                        </Select>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={18}>
                        <Input
                          value={amount}
                          onChange={this.onAmountChange}
                          placeholder="amount for providing to the pool"
                        />
                      </Col>
                    </Row>
                    {isNotZeroLike(amount) ? (
                      <p className={styles.cal}>
                        You Will Receive: <span>{format(reAmount)}</span> re{selectedCoin}
                      </p>
                    ) : null}
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.modalVisible.show}
                    >
                      Deposit
                    </Button>
                  </div>
                </Auth>

                <ModalRender
                  visible={modalVisible}
                  title="Comfirm Deposit"
                  className={commonStyles.commonModal}
                  onCancel={this.modalVisible.hide}
                  height={300}
                  footer={null}
                >
                  <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                    <Descriptions.Item label="Deposit Amount" span={24}>
                      {amount} {selectedCoin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Receive" span={24}>
                      {reAmount} re{selectedCoin}
                    </Descriptions.Item>
                  </Descriptions>
                  <p>Tips: 14 Days Locked Required</p>
                  <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                    <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                      <Button onClick={this.modalVisible.hide}>Cancel</Button>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                      <Button onClick={this.confirmDeposit} type="primary">
                        Comfirm
                      </Button>
                    </Col>
                  </Row>
                </ModalRender>
              </div>
            </Hidden>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
