import { Component } from 'react';
import { Tabs, Button, Table, Row, Select, Col, Icon, Tag } from 'antd';
import styles from './balance.module.less';
import commonStyles from '../funding-balance/modals/style.module.less';
import ColumnConvert from '../column-convert/index';
import dayjs from 'dayjs';
import { SupportedCoins, DefaultCoinDatas } from '../../constant/index';
import ModalRender from '../modal-render/index';
import SiteContext from '../../layouts/SiteContext';
import CardInfo from '../card-info/index';
import {
  getPoolBalance,
  doPoolWithdraw,
  getPubPoolWithdrawDeadline,
  getCollaborativeWithdrawRe,
} from '../../services/pool.service';
import { Visible } from '../builtin/hidden';
import { isNumberLike, isNotZeroLike, format, isGreaterZero } from '../../util/math';
import Placeholder from '../placeholder/index';
import InputNumber from '../input/index';
import { formatTime } from '../../util/time';

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
        return formatTime(value);
      case 'amount':
      case 'balance':
        return format(value);
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
  selectCoin?: IUSDCoins;
  coins: { [key: string]: number };
  deadline: string;
  deadlineLoading: boolean;
  amount: any;
  reAmount?: number;
  unlockInfos: { [coin: string]: string };
  calculating: boolean;
  withdrawBtnEnable: boolean;
}

type TModalKeys = Pick<IState, 'withDrawVisible' | 'recordVisible'>;

export default class PoolPage extends Component<{ isPrivate: boolean }, IState> {
  state: IState = {
    withDrawVisible: false,
    recordVisible: false,
    data: [],
    loading: false,
    calculating: false,
    coins: { ...DefaultCoinDatas },
    deadline: '',
    amount: '',
    withdrawBtnEnable: false,
    deadlineLoading: false,
    unlockInfos: {},
  };

  onAmountChange = (amount: number) => {
    this.setState({
      amount,
    });
    this.calculateRe({ amount });
  };

  calculateRe = async (newVal: { amount?: number | string; selectCoin?: IUSDCoins }) => {
    console.log('...doCalculate');

    if (this.props.isPrivate) {
      return;
    }
    const { amount, selectCoin } = this.state;

    if (!isNotZeroLike(amount)) {
      this.setState({
        reAmount: 0,
      });
      return;
    }

    const param = {
      amount,
      selectCoin,
      ...newVal,
    };
    // @ts-ignore
    try {
      this.setState({
        calculating: true,
      });
      // @ts-ignore
      const reAmount = await getCollaborativeWithdrawRe({ amount: param.amount, coin: param.selectCoin });
      this.setState({
        calculating: false,
        reAmount: Number(format(reAmount)),
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
    // try {
    const coins = await getPoolBalance(type);
    // @ts-ignore
    const availableCoins = coins && Object.keys(coins).filter(coin => isGreaterZero(coins[coin]));
    this.setState({
      coins,
      // @ts-ignore
      withdrawBtnEnable: availableCoins && availableCoins.length,
      // @ts-ignore
      selectCoin: availableCoins && availableCoins[0],
    });
    // } catch (e) {}

    if (!isPrivate) {
      this.setState({ deadlineLoading: true });
      const withdrawDeadline = await getPubPoolWithdrawDeadline();

      const now = new Date().getTime();

      const unlockInfos =
        withdrawDeadline && withdrawDeadline.length
          ? withdrawDeadline.reduce((total, { coin, time }) => {
              // @ts-ignore
              total[coin] =
                now < time ? dayjs(new Date(time)).set('second', 0).add(1, 'minute').format('YYYY-MM-DD HH:mm') : null;
              return total;
            }, {})
          : {};
      this.setState({
        deadlineLoading: false,
        unlockInfos,
      });
    }
    this.setState({ loading: false });
  }

  onSelectChange = (selectCoin: IUSDCoins) => {
    this.setState({ selectCoin });
    this.calculateRe({ selectCoin });
  };

  doWithdraw = async () => {
    const { isPrivate } = this.props;
    const { selectCoin, amount, reAmount } = this.state;

    if (isPrivate && !isNotZeroLike(amount)) {
      return;
    }

    if (!isPrivate && !isNotZeroLike(reAmount)) {
      return;
    }

    this.withDrawVisible.hide();
    await doPoolWithdraw({ amount, reAmount, coin: selectCoin, type: isPrivate ? 'private' : 'public' });
  };

  onMaxOpenClick = () => {
    const { coins, selectCoin } = this.state;
    this.setState({
      amount: coins[selectCoin!],
    });
  };

  render() {
    const {
      data,
      selectCoin,
      withdrawBtnEnable,
      deadline,
      loading,
      deadlineLoading,
      unlockInfos,
      calculating,
      coins,
      amount,
      reAmount,
    } = this.state;
    const { isPrivate } = this.props;
    const isLocked = !!unlockInfos[selectCoin!];
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <CardInfo isNumber={true} loading={loading} title="Liquidity Balance" theme="inner" items={coins}>
              <Placeholder loading={loading}>
                <Visible when={withdrawBtnEnable}>
                  <Button type="primary" onClick={this.withDrawVisible.show} className={styles.btn}>
                    {deadline ? `Withdraw until ${deadline}` : 'Withdraw'}
                  </Button>
                </Visible>
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
                {SupportedCoins.map(coin => (
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
                  <Select value={selectCoin} onChange={this.onSelectChange} style={{ width: '100%', height: 50 }}>
                    {SupportedCoins.filter(coin => isGreaterZero(coins[coin])).map(coin => (
                      <Option value={coin}>{coin}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18}>
                  <span className={[styles.maxWithdraw, isMobile ? styles.mobile : ''].join(' ')}>
                    <Tag onClick={this.onMaxOpenClick} color="#1346FF">
                      Max
                    </Tag>
                    <span>{format(coins[selectCoin!])}</span> {selectCoin}
                  </span>
                </Col>
                <Col span={24}>
                  <div className={[styles.repay, isMobile ? styles.mobile : ''].join(' ')}>
                    <InputNumber
                      disabled={isLocked}
                      onChange={this.onAmountChange}
                      placeholder={isLocked ? `Unlock until ${unlockInfos[selectCoin!]}` : 'Withdraw amount'}
                      max={coins[selectCoin!]}
                    />
                    {isPrivate ? null : (
                      <>
                        {isLocked ? null : (
                          <p>
                            {calculating ? <Icon type="loading" /> : reAmount}
                            <span>
                              &nbsp;re{selectCoin} -&gt; {amount} {selectCoin}
                            </span>
                          </p>
                        )}
                        <p>reToken will be automatically burnt. Stable coin will send to your address.</p>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className={commonStyles.actionBtns} gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Button onClick={this.withDrawVisible.hide}>CANCEL</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Button type="primary" onClick={isLocked ? this.withDrawVisible.hide : this.doWithdraw}>
                    {isLocked ? `Got it` : 'WITHDRAW'}
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
