import { Row, Col, Radio, Input, Tag, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';
import { getFundingBalanceInfo, deposit, withdraw, openOrder } from '../../services/trade.service';
import { getMaxFromCoin, getFee, getLocked } from './calculate';
import { format, isGreaterZero } from '../../util/math';
import InputNumber from '../input/index';
import Placeholder from '../placeholder/index';

interface IState {
  depositVisible: boolean;
  withdrawVisible: boolean;
  orderConfirmVisible: boolean;
  tradeType: ITradeType;
  balanceInfo?: IBalanceInfo;
  openAmount: number | undefined;
  maxNumber?: number;
  loading: boolean;
}

type TModalKeys = Pick<IState, 'withdrawVisible' | 'depositVisible' | 'orderConfirmVisible'>;

export default class Balance extends Component<{
  coins: { from: IFromCoins; to: IUSDCoins };
  curPrice?: number;
}> {
  state: IState = {
    depositVisible: false,
    withdrawVisible: false,
    orderConfirmVisible: false,
    openAmount: undefined,
    tradeType: 'long',
    loading: false,
  };

  static contextType = SiteContext;

  componentDidMount = () => {
    this.loadBalanceInfo();
  };

  loadBalanceInfo = async () => {
    const { coins, curPrice } = this.props;
    const { to } = coins;
    try {
      this.setState({ loading: true });
      const balanceInfo =
        process.env.NODE_ENV === 'development'
          ? {
              balance: 9922332423.432223,
              locked: 32432.091232,
              // available: 9922332423.432223 - 32432.0912328,
            }
          : await getFundingBalanceInfo(to);

      const maxNumber = getMaxFromCoin(balanceInfo, process.env.NODE_ENV === 'development' ? 100 : curPrice);
      this.setState({
        balanceInfo,
        maxNumber,
        loading: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  deposit = async (amount?: number) => {
    if (!amount || amount <= 0) {
      return;
    }

    this.depositVisible.hide();
    const { coins } = this.props;
    const success = await deposit({ amount, coin: coins.to });
    if (success) {
      this.loadBalanceInfo();
    }
  };

  withdraw = async (amount: number, coin: IUSDCoins) => {
    if (!amount || amount <= 0) {
      return;
    }
    this.withdrawVisible.hide();
    const success = await withdraw({ amount, coin });
    if (success) {
      this.loadBalanceInfo();
    }
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

  withdrawVisible = this.setModalVisible('withdrawVisible');
  depositVisible = this.setModalVisible('depositVisible');
  orderConfirmVisible = this.setModalVisible('orderConfirmVisible');

  changeType = (e: any) => {
    console.log(e);
    this.setState({
      tradeType: e.target.value,
    });
  };

  onOpenAmountChange = (openAmount: number) => {
    this.setState({
      openAmount,
    });
  };

  onOpen = async () => {
    const { coins } = this.props;
    const { to } = coins;
    const { tradeType, openAmount } = this.state;
    this.orderConfirmVisible.hide();
    const success = await openOrder(to, tradeType, openAmount!);
  };

  render() {
    const {
      depositVisible,
      withdrawVisible,
      orderConfirmVisible,
      tradeType,
      balanceInfo,
      loading,
      openAmount,
      maxNumber,
    } = this.state;
    const { coins, curPrice } = this.props;
    const { from, to } = coins;

    const price = process.env.NODE_ENV === 'development' ? 100 : curPrice;
    const address = this.context.address;

    const fee = getFee(openAmount, price);
    const locked = openAmount! + fee;
    const openData = {
      type: tradeType,
      price,
      amount: openAmount,
      locked,
      fee: fee,
      coins: coins,
    };
    return (
      <SiteContext.Consumer>
        {({ account }) => (
          <div className={styles.root}>
            <h2>
              Funding Balance<span>({to})</span>
            </h2>
            <p className={styles.balanceVal}>
              <Placeholder loading={loading}>{format(balanceInfo?.balance)}</Placeholder>
            </p>
            <div className={styles.dayChange}>
              <Placeholder loading={loading}>
                {format(balanceInfo?.locked)}&nbsp;<span>Locked</span>
              </Placeholder>
            </div>
            <Row className={styles.actionLink} type="flex" justify="space-between">
              <Col>
                <Button type="link" onClick={() => address && this.depositVisible.show()}>
                  DEPOSIT
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={() => address && this.withdrawVisible.show()}>
                  WITHDRAW
                </Button>
              </Col>
            </Row>
            <Row className={styles.radioBtn}>
              <Radio.Group value={tradeType} onChange={this.changeType}>
                <Radio.Button value="long" className={styles.red}>
                  LONG
                </Radio.Button>
                <Radio.Button value="short" className={styles.green}>
                  SHORT
                </Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>
              <Placeholder loading={loading}>
                Current Price: {format(price)} {to}
              </Placeholder>
            </p>
            <p className={styles.amountTip}>Amount</p>
            <InputNumber
              className={styles.orderInput}
              onChange={this.onOpenAmountChange}
              placeholder={maxNumber ? `Max ${maxNumber}` : '0.00'}
              max={maxNumber}
              showTag={true}
              tagClassName={styles.utilMax}
              suffix={'ETH'}
            />
            <p className={styles.settlement}>
              Settlement Fee : {fee} {to}
            </p>
            {/* <Progress strokeColor="#1346FF" showInfo={false} percent={30} strokeWidth={20} /> */}
            <Button
              className={tradeType === 'short' ? 'buttonGreen' : 'buttonRed'}
              type="primary"
              onClick={() => {
                if (!isGreaterZero(openAmount)) {
                  return;
                }
                this.orderConfirmVisible.show();
              }}
            >
              OPEN
            </Button>

            <DespositModal
              coin={to}
              max={account && account.USDBalance ? account?.USDBalance[to] : undefined}
              onCancel={this.depositVisible.hide}
              onConfirm={this.deposit}
              visible={depositVisible}
            />
            <WithdrawModal
              coin={to}
              onCancel={this.withdrawVisible.hide}
              onConfirm={this.withdraw}
              max={balanceInfo?.available}
              visible={withdrawVisible}
            />
            <OrderConfirm
              data={openData}
              onConfirm={this.onOpen}
              onCancel={this.orderConfirmVisible.hide}
              visible={orderConfirmVisible}
            />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
