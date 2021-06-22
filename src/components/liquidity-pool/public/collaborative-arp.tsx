import { CustomTabKey, CoinSelectOption } from '../../../constant/index';
import { Tabs, Button, Row, Col, Select, Icon, Descriptions } from 'antd';
import styles from '../style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import { Component } from 'react';
import { format, isNotZeroLike, isGreaterZero, isNumberLike } from '../../../util/math';
import { getCollaborativeArp } from '../../../services/pool.service';
import ModalRender from '../../modal-render/index';
import commonStyles from '../../funding-balance/modals/style.module.less';
import { getCollaborativeDepositRe, doCollaborativeDeposit } from '../../../services/pool.service';
import Auth from '../../builtin/auth';
import { Hidden } from '../../builtin/hidden';
import Placeholder from '../../placeholder/index';
import InputNumber from '../../input/index';
import { formatMessage } from 'util/i18n';

const { Option } = Select;

interface IState {
  data: number | '';
  loading: boolean;
  modalVisible: boolean;
  selectedCoin: IUSDCoins;
  amount: number | undefined;
  reAmount: number | undefined;
  calculating: boolean;
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
    reAmount: 0,
    calculating: false,
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
    this.setState({
      selectedCoin,
    });
    // @ts-ignore
    this.calculateRe({ coin: selectedCoin });
  };

  onAmountChange = (amount: number) => {
    this.setState({
      amount,
    });
    this.calculateRe({ amount });
  };

  confirmDeposit = async () => {
    const { amount, selectedCoin } = this.state;
    this.modalVisible.hide();
    const success = await doCollaborativeDeposit({ amount: amount!, coin: selectedCoin });
    if (success) {
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  calculateRe = async (newVal: { amount?: number | string; coin?: IUSDCoins }) => {
    const { selectedCoin, amount } = this.state;
    console.log('...amount');
    const params = {
      amount,
      coin: selectedCoin,
      ...newVal,
    };

    if (!isGreaterZero(params.amount)) {
      this.setState({
        reAmount: 0,
      });
      return;
    }
    this.setState({ calculating: true });
    // @ts-ignore
    const reAmount = await getCollaborativeDepositRe(params);
    this.setState({ calculating: false });
    this.setState({
      reAmount: isNumberLike(reAmount) ? reAmount : 0,
    });
  };

  render() {
    const { data, modalVisible, calculating, loading, amount, selectedCoin, reAmount } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <div style={{ paddingTop: '10px' }}>
              <h3>{formatMessage({ id: 'arp' })}</h3>
              <p className={styles.coins}>
                <Placeholder loading={false} width={'5em'}>
                  {isNumberLike(data) ? `${data}%` : 'N/A'}
                </Placeholder>
              </p>
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
                        {/* {CoinSelectOption} */}
                        <Option value="DAI">DAI</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={18}>
                      <InputNumber
                        min={1}
                        onChange={this.onAmountChange}
                        placeholder={formatMessage({ id: 'min-amount-one-dai' })}
                      />
                    </Col>
                  </Row>
                  {/* {isNotZeroLike(amount) ? ( */}
                  <p className={styles.cal}>
                    {calculating ? (
                      <>
                        {formatMessage({ id: 'you-will-receive' })} <Icon type="loading" />
                      </>
                    ) : (
                      <>{formatMessage({ id: 'you-will-receive', amount: format(reAmount), coin: selectedCoin })}</>
                    )}
                  </p>
                  {/* ) : null} */}
                  <Button type="primary" className={styles.btn} onClick={this.modalVisible.show}>
                    {formatMessage({ id: 'deposit' })}
                  </Button>
                </div>
              </Auth>

              <ModalRender
                visible={modalVisible}
                title={formatMessage({ id: 'comfirm-deposit' })}
                className={commonStyles.commonModal}
                onCancel={this.modalVisible.hide}
                height={300}
                footer={null}
              >
                <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                  <Descriptions.Item label={formatMessage({ id: 'amount' })} span={24}>
                    {amount} {selectedCoin}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'receive' })} span={24}>
                    {reAmount} re{selectedCoin}
                  </Descriptions.Item>
                </Descriptions>
                <p>{formatMessage({ id: 'tips-14-days-locked-required' })}</p>
                <Row className={commonStyles.actionBtns} gutter={[16, 16]} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button onClick={this.modalVisible.hide}>{formatMessage({ id: 'cancel' })}</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button onClick={this.confirmDeposit} type="primary">
                      {formatMessage({ id: 'confirm' })}
                    </Button>
                  </Col>
                </Row>
              </ModalRender>
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
