import { CustomTabKey, CoinSelectOption } from '../../constant/index';
import { Tabs, Button, Row, Col, Select, Input, Alert, Descriptions } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { Component } from 'react';
import { format } from '../../util/math';
import { getCollaborativeArp } from '../../services/pool.service';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';

interface IState {
  data: number | '';
  loading: boolean;
  modalVisible: boolean;
  selectedCoin: IUSDCoins
  amount: number | undefined;
}

interface IProps {
  address: string;
}
type TModalKeys = Pick<IState, 'modalVisible'>;

export default class LiquidityProvided extends Component<IProps, IState> {
  state: IState = {
    data: '',
    loading: false,
    modalVisible: false,
    selectedCoin: 'DAI',
    amount: undefined
  };

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: () =>
        this.setState({
          [key]: true,
        }),
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

  onSelectChange = () => {

  }

  onAmountChange = () => {

  }

  render() {
    const { data, modalVisible, amount, selectedCoin } = this.state;
    const { address } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <h3>ARP</h3>
            <p className={styles.coins}>{data}%</p>

            {address ? (
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
                    <Input value={amount} onChange={this.onAmountChange} placeholder="amount for providing to the pool" />
                  </Col>
                </Row>
                <p className={styles.cal}>
                  You Will Receive: <span>94204</span> reDAI
                </p>
                <Button type="primary" className={styles.btn} onClick={this.modalVisible.show}>
                  Deposit
                </Button>
              </div>
            ) : null}

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
                  10.36 DAI
                </Descriptions.Item>
                <Descriptions.Item label="Receive" span={24}>
                  10.36 reDAI
                </Descriptions.Item>
              </Descriptions>
              <p>说明：将冻结14天</p>
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
        )}
      </SiteContext.Consumer>
    );
  }
}
