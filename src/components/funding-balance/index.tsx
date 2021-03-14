import { Row, Col, Radio, Input, Tag, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';
import { getCurPrice, getFundingBalanceInfo, deposit, withdraw } from '../../services/trade.service';
import { getMaxFromCoin, getFee, getLocked } from './calculate';
import { format } from '../../util/math';

interface IState {
  depositVisible: boolean;
  withdrawVisible: boolean;
  orderConfirmVisible: boolean;
  tradeType: ITradeType;
  balanceInfo?: IBalanceInfo;
  openAmount: number | undefined;
  curPrice?: number;
}

type TModalKeys = Pick<IState, 'withdrawVisible' | 'depositVisible' | 'orderConfirmVisible'>;

export default class Balance extends Component<{
  coins: { from: IFromCoins; to: IUSDCoins };
  graphData?: IPriceGraph;
}> {
  state: IState = {
    depositVisible: false,
    withdrawVisible: false,
    orderConfirmVisible: false,
    openAmount: undefined,

    tradeType: 'long',
  };

  static contextType = SiteContext;

  componentDidMount = async () => {
    const { coins } = this.props;
    const { to } = coins;
    const balanceInfo = await getFundingBalanceInfo(to);
    const curPrice = await getCurPrice(to);

    this.setState({
      balanceInfo,
      curPrice,
    });
  };

  deposit = (amount?: number) => {
    if (!amount || amount <= 0) {
      return;
    }

    const { coins } = this.props;
    // TODO 加载动画，禁止用户操作
    deposit({ amount, coin: coins.to })
      .then((rs: boolean) => {
        // TODO 停止动画
        console.log('get rs', rs);
        if (rs) {
          this.depositVisible.hide();
          // TODO 重新获取账户余额
        } else {
          // TODO 提示操作失败
        }
      })
      .catch((err) => {
        // TODO 未知错误
      });
  };

  withdraw = (coin: IUSDCoins, amount?: number) => {
    if (!amount || amount <= 0) {
      return;
    }
    // TODO 启动动画
    withdraw({ amount, coin })
      .then((rs: boolean) => {
        // TODO 关闭动画
        if (rs) {
          this.withdrawVisible.hide();
          // TODO 刷新账户余额
        } else {
          // TODO 操作失败
        }
      })
      .catch((err) => {});
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
    const { balanceInfo } = this.state;
    const { graphData } = this.props;
    const maxNumber = getMaxFromCoin(balanceInfo, this.state.curPrice);
    this.setState({
      openAmount: maxNumber,
    });
  };

  onOpen = () => {
    console.log('onOpen');
  };

  render() {
    const {
      depositVisible,
      withdrawVisible,
      orderConfirmVisible,
      tradeType,
      balanceInfo,
      openAmount,
      curPrice,
    } = this.state;
    const { coins } = this.props;
    const { from, to } = coins;

    const price = curPrice;
    const address = this.context.account.address;
    const maxNumber = getMaxFromCoin(balanceInfo, price);

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
                  Deposit
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={() => address && this.withdrawVisible.show()}>
                  Withdraw
                </Button>
              </Col>
            </Row>
            <Row className={styles.radioBtn}>
              <Radio.Group value={tradeType} onChange={this.changeType}>
                <Radio.Button value="long">Long</Radio.Button>
                <Radio.Button value="short" className={styles.green}>
                  Short
                </Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>
              Current Price: {this.state.curPrice} {to}
            </p>
            <p className={styles.amountTip}>Amount</p>
            <Input
              className={styles.orderInput}
              value={openAmount}
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
              className={tradeType === 'short' ? 'buttonGreen' : ''}
              type="primary"
              onClick={this.orderConfirmVisible.show}
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
