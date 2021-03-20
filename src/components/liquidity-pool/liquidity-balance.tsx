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
import {
  getPoolBalance,
  doPoolWithdraw,
  getPoolWithDrawDeadline,
  getCollaborativeWithdrawRe,
} from '../../services/pool.service';
import { isNumberLike, isNotZeroLike, format } from '../../util/math';
import Hidden from '../builtin/hidden';
import Placeholder from '../placeholder/index';

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

// const data: ITransfer[] = [
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
//   {
//     time: new Date().getTime(),
//     type: 'WithDraw',
//     amount: 100,
//     balance: 892.03,
//   },
// ];
interface IState {
  withDrawVisible: boolean;
  recordVisible: boolean;
  data: Array<{ label: string; value: any }>;
  loading: boolean;
  selectCoin: IUSDCoins;
  coins: { [key: string]: number };
  deadline: string;
  deadlineLoading: boolean;
  amount: any;
  reAmount?: number;
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
    amount: '',
    deadlineLoading: true,
  };

  onAmountChange = (e: any) => {
    const val = e.target.value;
    this.setState({
      amount: val,
    });
    this.calculateRe({ amount: val });
  };

  calculateRe = async (newVal: { amount?: number | string; selectCoin?: IUSDCoins }) => {
    const { amount, selectCoin } = this.state;
    const param = {
      amount,
      selectCoin,
      ...newVal,
    };
    // @ts-ignore
    try {
      const reAmount = await getCollaborativeWithdrawRe({ amount, coin: param.selectCoin });
      this.setState({
        reAmount,
      });
    } catch (e) {
      console.log(e);
    }
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
      const coins = await getPoolBalance(type);
      this.setState({
        coins,
        // data: data.map(({ amount, coin }) => ({
        //   label: coin,
        //   value: format(amount),
        // })),
        // coins: data.reduce((all, { amount, coin }) => {
        //   // @ts-ignore
        //   all[coin] = amount;
        //   return all;
        // }, {}),
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
    this.calculateRe({ selectCoin });
  };

  doWithdraw = async () => {
    this.withDrawVisible.hide();
    const { isPrivate } = this.props;
    const { selectCoin, amount, reAmount } = this.state;
    await doPoolWithdraw({ amount, reAmount, coin: selectCoin, type: isPrivate ? 'private' : 'public' });
  };
  render() {
    const { data, selectCoin, deadline, loading, deadlineLoading, coins, amount, reAmount } = this.state;
    const { isPrivate } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
            <div>
              <CardInfo loading={loading} title="Liquidity Balance" theme="inner" items={coins}>
                <Placeholder loading={deadlineLoading}>
                  <Button
                    type="primary"
                    disabled={!!deadline}
                    onClick={this.withDrawVisible.show}
                    className={styles.btn}
                  >
                    {deadline ? `Withdraw until ${deadline}` : 'Withdraw'}
                  </Button>
                  {/* <Button type="link" onClick={this.recordVisible.show} className={styles.link}>
                    Liquidity Balance History
                  </Button> */}
                </Placeholder>
              </CardInfo>
              <ModalRender
                visible={this.state.recordVisible}
                title="Liquidity Balance History"
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
                      <Input
                        type="number"
                        value={amount}
                        onChange={this.onAmountChange}
                        placeholder="Amount"
                        max={coins[selectCoin]}
                      />
                      {isPrivate ? null : (
                        <p>{isNumberLike(reAmount) ? `${format(reAmount)} reDAI you need to pay` : null}</p>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row className={commonStyles.actionBtns} gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Button onClick={this.withDrawVisible.hide}>Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Button
                      type="primary"
                      disabled={isPrivate ? !isNotZeroLike(amount) : !isNotZeroLike(reAmount)}
                      onClick={this.doWithdraw}
                    >
                      WITHDRAW
                    </Button>
                  </Col>
                </Row>
              </ModalRender>
            </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
