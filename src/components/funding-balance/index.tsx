import { Row, Col, Radio, Icon } from 'antd';
import styles from './style.module.less';
import DepositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import dayjs from 'dayjs';
import SiteContext from '../../layouts/SiteContext';
import { deposit, withdraw, createOrder } from '../../services/trade.service';
import InputNumber from '../input/index';
import Placeholder from '../placeholder/index';
import { setPendingOrders } from '../../util/order-cache';
import { formatMessage } from 'locale/i18n';
import { Setting } from './dropdown/setting';
import { BaseStateComponent } from '../../state-manager/base-state-component';
import { toEtherNumber } from '../../util/ethers';
import { BigNumber } from 'ethers';
import { P } from '../../state-manager/page/page-state-parser';
import { S } from '../../state-manager/contract/contract-state-parser';
import { PageTradingPair, TradeDirection, TradeOrderFees, UserTradeAccountInfo } from '../../state-manager/state-types';

interface IState {
  fundingBalance: UserTradeAccountInfo | null;
  fundingBalancePending: boolean;
  curTradingPrice: BigNumber | null;
  curTradingPricePending: boolean;
  maxOpenAmount: BigNumber | null;
  curOpenAmount: number;
  openOrderFees: TradeOrderFees | null;
  openOrderFeesPending: boolean;
  tradingPair: PageTradingPair;
  tradingDirection: TradeDirection;
}

interface IProps {
  coins: { from: IFromCoins; to: IUSDCoins };
  timestamp: any;
}

/**
 * Funding Balance
 */
export default class Balance extends BaseStateComponent<IProps, IState> {
  static contextType = SiteContext;

  state: IState = {
    fundingBalance: null,
    fundingBalancePending: false,
    curTradingPrice: null,
    curTradingPricePending: false,
    maxOpenAmount: null,
    curOpenAmount: P.Trade.Create.OpenAmount.get(),
    openOrderFees: null,
    openOrderFeesPending: false,
    tradingPair: P.Trade.Pair.get(),
    tradingDirection: P.Trade.Direction.get(),
  };

  componentDidMount = () => {
    this.registerState('tradingPair', P.Trade.Pair);
    this.registerState('tradingDirection', P.Trade.Direction);
    this.registerState('curOpenAmount', P.Trade.Create.OpenAmount);

    this.registerState('fundingBalance', S.User.CurTradePairAccount);
    this.registerStatePending('fundingBalancePending', S.User.CurTradePairAccount);
    this.registerState('curTradingPrice', S.Trade.CurPairPrice);
    this.registerStatePending('curTradingPricePending', S.Trade.CurPairPrice);
    this.registerState('maxOpenAmount', S.Trade.Create.CurMaxOpenAmount);
    this.registerState('openOrderFees', S.Trade.Create.CurOpenOrderFee);
    this.registerStatePending('openOrderFeesPending', S.Trade.Create.CurOpenOrderFee);
  };

  componentWillUnmount() {
    this.destroyState();
  }

  private baseCoinNum(num: BigNumber | null | undefined): string {
    return toEtherNumber(num, 2, this.state.tradingPair.base);
  }

  private quoteCoinNum(num: BigNumber | null | undefined): string {
    return toEtherNumber(num, 2, this.state.tradingPair.quote);
  }

  private feeNum(num: BigNumber | null | undefined): string {
    return toEtherNumber(num, 3, this.state.tradingPair.quote);
  }

  UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      this.refreshBalanceValue();
    }
  }

  refreshBalanceValue() {
    this.tickState(
      S.User.CurTradePairAccount,
      S.User.WalletBalance.DAI,
      S.User.WalletBalance.USDT,
      S.User.WalletBalance.USDC,
      S.User.DepositWalletBalance
    );
  }

  doDeposit(amount: number) {
    deposit({ amount, coin: this.state.tradingPair.quote.description as IUSDCoins })
      .then((done: boolean) => {
        if (done) {
          this.refreshBalanceValue();
        }
      })
      .catch(err => {
        console.warn('deposit error', err);
      });
  }

  doWithdraw(amount: number) {
    withdraw({ amount, coin: this.state.tradingPair.quote.description as IUSDCoins })
      .then((done: boolean) => {
        if (done) {
          this.refreshBalanceValue();
        }
      })
      .catch(err => {
        console.warn('withdraw error', err);
      });
  }

  switchTradeDirection(e: any) {
    const direction: TradeDirection = e.target.value;
    P.Trade.Direction.set(direction);
  }

  changeOpenAmount(amount: number) {
    if (amount >= 0) {
      P.Trade.Create.OpenAmount.set(amount);
    }
  }

  onCreateOrder() {
    const curPrice: number = Number(this.quoteCoinNum(this.state.openOrderFees?.curPrice));
    if (!curPrice || curPrice === 0) {
      return;
    }

    const openTime = new Date().getTime();

    createOrder(
      P.Trade.Pair.get().quote.description as IUSDCoins,
      P.Trade.Direction.get(),
      P.Trade.Create.OpenAmount.get(),
      Number(this.quoteCoinNum(this.state.openOrderFees?.curPrice))
    )
      .then(newOrderId => {
        if (newOrderId) {
          setPendingOrders({
            hash: newOrderId,
            time: openTime,
            type: P.Trade.Direction.get(),
            amount: P.Trade.Create.OpenAmount.get(),
            cost: this.quoteCoinNum(this.state.openOrderFees?.fundingLocked),
            fee: this.quoteCoinNum(this.state.openOrderFees?.settlementFee),
            price: curPrice,
            status: 'PENDING',
            costCoin: this.state.tradingPair.quote.description,
            $expireTime: dayjs(new Date(openTime)).add(20, 'minute').toDate().getTime(),
          });

          this.refreshBalanceValue();
          P.Trade.Create.OpenAmount.setToDefault();
          this.context.refreshPage && this.context.refreshPage();
        }
      })
      .catch(err => {
        console.warn('create order error', err);
      });
  }

  render() {
    return (
      <SiteContext.Consumer>
        {({ isBSC }) => (
          <div className={styles.root}>
            <h2>
              Funding Balance <span>({this.state.tradingPair.quote.description})</span>
              {isBSC ? <Setting /> : null}
            </h2>

            {/* funding balance */}
            <p className={styles.balanceVal}>
              <Placeholder
                height={'42px'}
                loading={this.state.fundingBalance === null || this.state.fundingBalancePending}
              >
                {this.quoteCoinNum(this.state.fundingBalance?.balance)}
              </Placeholder>
            </p>

            {/* funding locked */}
            <div className={styles.dayChange}>
              <Placeholder
                height={'16px'}
                loading={this.state.fundingBalance === null || this.state.fundingBalancePending}
              >
                {this.quoteCoinNum(this.state.fundingBalance?.locked)}
                &nbsp;
                <span>{formatMessage({ id: 'locked' })}</span>
              </Placeholder>
            </div>

            {/* deposit/withdraw options */}
            <Row className={styles.actionLink} type="flex" justify="space-between">
              <Col>
                <DepositModal onConfirm={this.doDeposit.bind(this)} />
              </Col>
              <Col>
                <WithdrawModal onConfirm={this.doWithdraw.bind(this)} />
              </Col>
            </Row>

            {/* LONG/SHORT switch */}
            <Row className={styles.radioBtn}>
              <Radio.Group value={this.state.tradingDirection} onChange={this.switchTradeDirection.bind(this)}>
                <Radio.Button value="LONG" className={styles.green}>
                  {formatMessage({ id: 'order-type-long' })}
                </Radio.Button>
                <Radio.Button value="SHORT" className={styles.red}>
                  {formatMessage({ id: 'order-type-short' })}
                </Radio.Button>
              </Radio.Group>
            </Row>

            {/* current base token price */}
            <p className={styles.price}>
              <Placeholder
                height={'14px'}
                loading={this.state.curTradingPrice === null || this.state.curTradingPricePending}
              >
                Current Price: {this.quoteCoinNum(this.state.curTradingPrice)}{' '}
                {this.state.tradingPair.quote.description}
              </Placeholder>
            </p>

            <p className={styles.amountTip}>{formatMessage({ id: 'amount' })}</p>

            {/* base coin amount input */}
            <InputNumber
              className={styles.orderInput}
              onChange={this.changeOpenAmount.bind(this)}
              placeholder={
                this.state.maxOpenAmount !== null
                  ? `${formatMessage({ id: 'max' })} ${this.baseCoinNum(this.state.maxOpenAmount)}`
                  : '0.00'
              }
              value={this.state.curOpenAmount}
              max={Number(this.baseCoinNum(this.state.maxOpenAmount))}
              skip={true}
              showTag={true}
              tagClassName={styles.utilMax}
              suffix={this.state.tradingPair.base.description}
            />

            {/* settlement fee */}
            <p className={styles.settlement}>
              {formatMessage({ id: 'settlement-fee' })}: &nbsp;
              {this.state.openOrderFeesPending ? (
                <Icon type="loading" />
              ) : (
                <span>
                  {this.feeNum(this.state.openOrderFees?.settlementFee)} &nbsp;
                  {this.state.tradingPair.quote.description}
                </span>
              )}
            </p>

            {/* confirm order */}
            <OrderConfirm onConfirm={this.onCreateOrder.bind(this)} />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
