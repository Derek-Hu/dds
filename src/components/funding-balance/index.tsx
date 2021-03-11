import { Row, Col, Radio, Input, Tag, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';
import { getFundingBalanceInfo } from '../../services/trade.service';
import { getMaxFromCoin, getFee, getLocked } from './calculate';
import { format } from '../../util/math';

interface IState {
  depositVisible: boolean;
  withdrawVisible: boolean;
  orderConfirmVisible: boolean;
  tradeType: ITradeType;
  balanceInfo?: IBalanceInfo;
  openAmount: number | undefined;
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

  componentDidMount = async () => {
    const { coins } = this.props;
    const { to } = coins;
    const balanceInfo = await getFundingBalanceInfo(to);

    this.setState({
      balanceInfo,
    });
  };

  deposit = () => {
    console.log('deposit');
  };

  withdraw = () => {
    console.log('withdraw');
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
    const maxNumber = getMaxFromCoin(balanceInfo, graphData?.price);
    this.setState({
      openAmount: maxNumber,
    });
  };

  onOpen = () => {
    console.log('onOpen');
  };

  render() {
    const { depositVisible, withdrawVisible, orderConfirmVisible, tradeType, balanceInfo, openAmount } = this.state;
    const { coins, graphData } = this.props;
    const { from, to } = coins;

    const price = graphData?.price;
    const maxNumber = getMaxFromCoin(balanceInfo, price);

    const fee = format(getFee(openAmount, price));
    const locked = format(getLocked(openAmount, price));
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
                <Button type="link" onClick={() => this.depositVisible.show()}>
                  Deposit
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={() => this.withdrawVisible.show()}>
                  Withdraw
                </Button>
              </Col>
            </Row>
            <Row className={styles.radioBtn}>
              <Radio.Group value={tradeType} onChange={this.changeType}>
                <Radio.Button value="Long">Long</Radio.Button>
                <Radio.Button value="Short" className={styles.green}>
                  Short
                </Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>
              Current Price: {graphData?.price} {to}
            </p>
            <p className={styles.amountTip}>Amount</p>
            <Input value={openAmount} onChange={this.onOpenAmountChange} placeholder="0.00" suffix={'ETH'} />

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
