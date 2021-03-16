import { Row, Col, Radio, Input, Tag, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';
import { getCurPrice, getFundingBalanceInfo, deposit, withdraw, openOrder } from '../../services/trade.service';
import { getMaxFromCoin, getFee, getLocked } from './calculate';
import { format, isNotZeroLike } from '../../util/math';

interface IState {
  depositVisible: boolean;
  withdrawVisible: boolean;
  orderConfirmVisible: boolean;
  tradeType: ITradeType;
  balanceInfo?: IBalanceInfo;
  openAmount: number | undefined;
  maxNumber?: number;
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
  };

  static contextType = SiteContext;

  componentDidMount = () => {
    this.loadBalanceInfo();
  };

  loadBalanceInfo = async () => {
    const { coins, curPrice } = this.props;
    const { to } = coins;
    try {
      const balanceInfo = await getFundingBalanceInfo(to);
      const maxNumber = getMaxFromCoin(balanceInfo, curPrice);
      this.setState({
        balanceInfo,
        maxNumber,
      });
    } catch (e){
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

  onOpenAmountChange = (e: any) => {
    this.setState({
      openAmount: e.target.value,
    });
  };

  onMaxOpenClick = () => {
    const { maxNumber } = this.state;
    this.setState({
      openAmount: maxNumber,
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
      openAmount,
      maxNumber,
    } = this.state;
    const { coins, curPrice } = this.props;
    const { from, to } = coins;

    const price = curPrice;
    const address = this.context.account?.address;

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
        {() => (
          <div className={styles.root}>
            <h2>
              Funding Balance<span>({to})</span>
            </h2>
            <p className={styles.balanceVal}>{balanceInfo?.balance}</p>
            <div className={styles.dayChange}>
              {balanceInfo?.locked} &nbsp;<span>Locked</span>
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
                  Long
                </Radio.Button>
                <Radio.Button value="short" className={styles.green}>
                  Short
                </Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>
              Current Price: {curPrice} {to}
            </p>
            <p className={styles.amountTip}>Amount</p>
            <Input
              className={styles.orderInput}
              value={openAmount}
              type="number"
              onChange={this.onOpenAmountChange}
              placeholder="0.00"
              suffix={'ETH'}
            />

            <Row className={styles.utilMax} type="flex" justify="space-between">
              <Col span={12}>
                <Tag onClick={this.onMaxOpenClick} color="#1346FF">
                  Max
                </Tag>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                {maxNumber} {from}
              </Col>
            </Row>
            <p className={styles.settlement}>
              Settlements Fee : {fee} {to}
            </p>
            {/* <Progress strokeColor="#1346FF" showInfo={false} percent={30} strokeWidth={20} /> */}
            <Button
              className={tradeType === 'short' ? 'buttonGreen' : 'buttonRed'}
              type="primary"
              onClick={() => {
                if(!isNotZeroLike(openAmount)){
                  return;
                }
                this.orderConfirmVisible.show()
              }}
            >
              Open
            </Button>

            <DespositModal onCancel={this.depositVisible.hide} onConfirm={this.deposit} visible={depositVisible} />
            <WithdrawModal
              coin={to}
              onCancel={this.withdrawVisible.hide}
              onConfirm={this.withdraw}
              max={maxNumber}
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
