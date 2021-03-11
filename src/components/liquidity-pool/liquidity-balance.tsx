import { Component } from 'react';
import { Tabs, Button, Modal, Table, Row, Select, Input, Col } from 'antd';
import styles from './balance.module.less';
import commonStyles from '../funding-balance/modals/style.module.less';
import ColumnConvert from '../column-convert/index';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { SupportedCoins } from '../../constant/index';
import ModalRender from '../modal-render/index';
import SiteContext from '../../layouts/SiteContext';
import CardInfo from '../card-info/index';
import { getPoolBalance, getPoolWithDrawDeadline } from '../../services/pool.service';
import { dividedPecent, format } from '../../util/math';
import Hidden from '../builtin/hidden';

const { TabPane } = Tabs;
const { Option } = Select;

interface ITransfer {
  time: number;
  type: 'WithDraw' | 'Deposit';
  amount: number;
  balance: number;
}

const columns = ColumnConvert<ITransfer, {}>({
  column: {
    time: 'Time',
    type: 'Type',
    amount: 'Amount',
    balance: 'Balance',
  },
  render(value, key) {
    switch (key) {
      case 'time':
        return dayjs(value).format('YYYY-MM-DD');
      case 'amount':
      case 'balance':
        return numeral(value).format('0,0.0000');
      default:
        return value;
    }
  },
});

const data: ITransfer[] = [
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
];
interface IState {
  withDrawVisible: boolean;
  recordVisible: boolean;
  data: Array<{ label: string; value: any }>;
  loading: boolean;
  selectCoin: IUSDCoins;
  coins: { [key: string]: number };
  deadline: string;
  deadlineLoading: boolean;
}

type TModalKeys = Pick<IState, 'withDrawVisible' | 'recordVisible'>;

export default class PoolPage extends Component<{ isPrivate: boolean }, IState> {
  state: IState = {
    withDrawVisible: false,
    recordVisible: false,
    data: [],
    loading: false,
    selectCoin: 'DAI',
    coins: {},
    deadline: '',
    deadlineLoading: true,
  };

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: () => {
        // @ts-ignore
        this.setState({ [key]: true });
      },
      hide: () => {
        // @ts-ignore
        this.setState({ [key]: false });
      },
    };
  };

  withDrawVisible = this.setModalVisible('withDrawVisible');
  recordVisible = this.setModalVisible('recordVisible');

  async componentDidMount() {
    const { isPrivate } = this.props;
    const type = isPrivate ? 'private' : 'public';
    this.setState({ loading: true });
    try {
      const data = await getPoolBalance(type);
      this.setState({
        data: data.map(({ amount, coin }) => ({
          label: coin,
          value: format(amount),
        })),
        coins: data.reduce((all, { amount, coin }) => {
          // @ts-ignore
          all[coin] = amount;
          return all;
        }, {}),
      });
    } catch (e) {}

    this.setState({ loading: false, deadlineLoading: true });

    const timestamp = await getPoolWithDrawDeadline(type);

    if (new Date().getTime() < timestamp) {
      this.setState({
        deadline: dayjs(new Date(timestamp)).set('second', 0).add(1, 'minute').format('YYYY-MM-DD HH:mm'),
        deadlineLoading: false,
      });
    } else {
      this.setState({
        deadline: '',
        deadlineLoading: false,
      });
    }
  }

  onSelectChange = (selectCoin: IUSDCoins) => {
    this.setState({ selectCoin });
  };

  render() {
    const { isPrivate } = this.props;
    const { data, selectCoin, deadline,loading, deadlineLoading, coins } = this.state;

    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <Hidden when={loading}>
            <div>
              <CardInfo title="Liquidity Balance" theme="inner" items={data}>
                <Hidden when={deadlineLoading}>
                  <Button
                    type="primary"
                    disabled={!!deadline}
                    onClick={this.withDrawVisible.show}
                    className={styles.btn}
                  >
                    {deadline ? `Withdraw until ${deadline}` : 'Withdraw'}
                  </Button>
                  <Button type="link" onClick={this.recordVisible.show} className={styles.link}>
                    Liquidity Balance Record
                  </Button>
                </Hidden>
              </CardInfo>
              <ModalRender
                visible={this.state.recordVisible}
                title="Liquidity Balance Record"
                className={commonStyles.commonModal}
                onCancel={this.recordVisible.hide}
                height={500}
                width={600}
                footer={null}
              >
                <Tabs defaultActiveKey="DAI" className={styles.innerTab}>
                  {SupportedCoins.map((coin) => (
                    <TabPane tab={coin} key={coin}>
                      <Table
                        rowKey="coin"
                        scroll={{ y: 200, x: 600 }}
                        columns={columns}
                        pagination={false}
                        dataSource={data}
                      />
                    </TabPane>
                  ))}
                </Tabs>
              </ModalRender>

              <ModalRender
                visible={this.state.withDrawVisible}
                title="Liquidity Withdraw"
                className={commonStyles.commonModal}
                okText={'Claim'}
                height={420}
                onCancel={this.withDrawVisible.hide}
                footer={null}
              >
                <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
                  <Col xs={24} sm={24} md={6} lg={6}>
                    <Select
                      defaultValue={selectCoin}
                      onChange={this.onSelectChange}
                      style={{ width: '100%', height: 50 }}
                    >
                      {SupportedCoins.map((coin) => (
                        <Option value={coin}>{coin}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={24} md={18} lg={18}>
                    <span className={[styles.maxWithdraw, isMobile ? styles.mobile : ''].join(' ')}>
                      Max Withdraw Balance: <span>{format(coins[selectCoin])}</span> {selectCoin}
                    </span>
                  </Col>
                  <Col span={24}>
                    <div className={[styles.repay, isMobile ? styles.mobile : ''].join(' ')}>
                      <Input placeholder="Withdraw amount" />
                      {isPrivate ? null : <p>XXX reDAI you need to pay</p>}
                    </div>
                  </Col>
                </Row>
                <Row className={commonStyles.actionBtns} gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Button>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Button type="primary">Withdraw</Button>
                  </Col>
                </Row>
              </ModalRender>
            </div>
          </Hidden>
        )}
      </SiteContext.Consumer>
    );
  }
}
