import { Row, Col, Radio, message, Icon, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import dayjs from 'dayjs';
import SiteContext from '../../layouts/SiteContext';
import {
  getFundingBalanceInfo,
  confirmOrder,
  deposit,
  withdraw,
  getCurPrice,
  createOrder,
  getMaxOpenAmount,
} from '../../services/trade.service';
import { getMaxFromCoin } from './calculate';
import { format, isGreaterZero, truncated, isNumberLike } from '../../util/math';
import InputNumber from '../input/index';
import Placeholder from '../placeholder/index';
import { setPendingOrders } from '../../util/order-cache';
import { formatMessage } from 'locale/i18n';
import { Setting } from './dropdown/setting';
import { UserTradeAccountInfo } from '../../state-manager/contract-state-types';
import { BaseStateComponent } from '../../state-manager/base-state-component';
import { P, S } from '../../state-manager';
import { PageTradingPair } from '../../state-manager/page-state-types';
import { ContractState } from '../../state-manager/interface';
import { map, switchMap } from 'rxjs/operators';
import { toEtherNumber } from '../../util/ethers';
import { Observable, of } from 'rxjs';
import { BigNumber } from 'ethers';

interface IState {
  depositVisible: boolean;
  withdrawVisible: boolean;
  orderConfirmVisible: boolean;
  tradeType: ITradeType;
  balanceInfo?: IBalanceInfo;
  openAmount: number | undefined;
  maxNumber?: number;
  available?: number;
  curPrice?: number; // 从链上读取的price
  loading: boolean;
  feeQuery: boolean;
  fees?: IOpenFee;
  setFeeQuery: boolean;

  fundingBalance: UserTradeAccountInfo | null;
  fundingBalancePending: boolean;
  curTradingPrice: BigNumber | null;
  tradingPair: PageTradingPair;
}

interface IProps {
  coins: { from: IFromCoins; to: IUSDCoins };
  timestamp: any;
}

type TModalKeys = Pick<IState, 'withdrawVisible' | 'depositVisible' | 'orderConfirmVisible'>;

export default class Balance extends BaseStateComponent<IProps, IState> {
  static contextType = SiteContext;

  state: IState = {
    depositVisible: false,
    withdrawVisible: false,
    orderConfirmVisible: false,
    openAmount: undefined,
    tradeType: 'LONG',
    available: undefined,
    curPrice: 0,
    setFeeQuery: false,
    loading: false,
    feeQuery: false,
    fundingBalance: null,
    fundingBalancePending: false,
    curTradingPrice: null,
    tradingPair: P.Trade.Pair.default(),
  };

  private fundingStateMap = new Map<string, ContractState<UserTradeAccountInfo>>([
    ['DAI', S.User.Account.DAI],
    ['USDT', S.User.Account.USDT],
    ['USDC', S.User.Account.USDC],
  ]);

  private curQuoteCurrency: Observable<string> = P.Trade.Pair.watch().pipe(map(pair => pair.quote.description || ''));

  componentDidMount = () => {
    this.registerSwitchState('fundingBalance', this.curQuoteCurrency, this.fundingStateMap);
    this.registerState('tradingPair', P.Trade.Pair);
    this.watch(
      'fundingBalancePending',
      this.curQuoteCurrency.pipe(
        switchMap((quote: string) => {
          return this.fundingStateMap.has(quote)
            ? (this.fundingStateMap.get(quote) as ContractState<UserTradeAccountInfo>).pending()
            : of(false);
        })
      )
    );

    this.loadBalanceInfo();
  };

  UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      this.loadBalanceInfo();
    }
  }

  loadBalanceInfo = async (damon?: boolean) => {
    const { coins } = this.props;
    const { to } = coins;
    try {
      if (!damon) {
        this.setState({ loading: true });
      }
      const balanceInfo = await getFundingBalanceInfo(to);
      const curPrice = await getCurPrice(to);
      const available = getMaxFromCoin(balanceInfo);
      const maxNumber = await getMaxOpenAmount(
        (coins.from + coins.to) as IExchangeStr,
        available,
        this.state.tradeType
      );
      this.setState({
        balanceInfo,
        available: truncated(available),
        maxNumber,
        curPrice,
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
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  withdraw = async (amount: number, coin: IUSDCoins) => {
    if (!amount || amount <= 0) {
      return;
    }
    this.withdrawVisible.hide();
    const success = await withdraw({ amount, coin });
    if (success) {
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: () =>
        // @ts-ignore
        this.setState({
          [key]: true,
        }),
      hide: () =>
        // @ts-ignore
        this.setState({
          [key]: false,
        }),
    };
  };

  withdrawVisible = this.setModalVisible('withdrawVisible');
  depositVisible = this.setModalVisible('depositVisible');
  orderConfirmVisible = this.setModalVisible('orderConfirmVisible');

  changeType = async (e: any) => {
    const tradeType: ITradeType = e.target.value;
    const { coins } = this.props;
    // 新的APi要求获取maxOpen时传入long，short类型，这里同步获取略有卡顿，后期可优化。 --by 蒜苗 2021-04-05
    const maxNumber = await getMaxOpenAmount((coins.from + coins.to) as IExchangeStr, this.state.available, tradeType);

    this.setState({
      tradeType: tradeType,
      maxNumber,
    });
  };

  onOpenAmountChange = async (openAmount: number) => {
    const { coins } = this.props;
    const { to } = coins;

    this.setState({
      openAmount,
    });

    this.setState({
      setFeeQuery: true,
    });
    const fees = await confirmOrder(openAmount, to, this.state.tradeType);
    this.setState({
      fees,
      setFeeQuery: false,
    });
  };

  onOpen = async () => {
    const { coins } = this.props;
    const { to } = coins;
    const { tradeType, openAmount, fees } = this.state;
    const curPrice = fees?.curPrice;

    if (!curPrice) {
      return;
    }

    this.orderConfirmVisible.hide();

    const openTime = new Date().getTime();
    const orderId = await createOrder(to, tradeType, openAmount!, curPrice);

    if (orderId) {
      setPendingOrders({
        hash: orderId,
        time: openTime,
        type: tradeType,
        amount: openAmount,
        cost: fees?.fundingFeeLocked,
        fee: fees?.settlementFee,
        price: fees?.curPrice,
        status: 'PENDING',
        costCoin: coins.to,
        $expireTime: dayjs(new Date(openTime)).add(20, 'minute').toDate().getTime(),
      });
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  queryFee = async () => {
    this.setState({
      feeQuery: true,
    });

    try {
      const { coins } = this.props;
      const { to } = coins;
      const { openAmount } = this.state;

      const fees = await confirmOrder(openAmount!, to, this.state.tradeType);
      this.orderConfirmVisible.show();
      this.setState({
        fees,
      });
    } catch {}
    this.setState({
      feeQuery: false,
    });
  };

  clickOpen = () => {
    const { openAmount, maxNumber } = this.state;
    if (!isGreaterZero(openAmount)) {
      return;
    }

    if (!isNumberLike(maxNumber)) {
      return;
    }

    if (maxNumber! < openAmount!) {
      message.warning(formatMessage({ id: 'more-balance-required-deposit-first' }));
      return;
    }

    this.queryFee();
  };

  render() {
    const {
      depositVisible,
      withdrawVisible,
      orderConfirmVisible,
      tradeType,
      balanceInfo,
      loading,
      fees,
      openAmount,
      maxNumber,
      setFeeQuery,
      feeQuery,
      curPrice, // 必须使用从链上读取的price
      available,
    } = this.state;
    const { coins } = this.props;
    const { from, to } = coins;

    const address = this.context.address;

    const openData = {
      type: tradeType,
      amount: openAmount,
      coins: coins,
    };
    return (
      <SiteContext.Consumer>
        {({ account, isBSC }) => (
          <div className={styles.root}>
            <h2>
              Funding Balance <span>({to})</span>
              {isBSC ? <Setting /> : null}
            </h2>

            <p className={styles.balanceVal}>
              <Placeholder
                height={'42px'}
                loading={this.state.fundingBalance === null || this.state.fundingBalancePending}
              >
                {toEtherNumber(this.state.fundingBalance?.balance, 2, this.state.tradingPair.quote)}
              </Placeholder>
            </p>

            <div className={styles.dayChange}>
              <Placeholder
                height={'16px'}
                loading={this.state.fundingBalance === null || this.state.fundingBalancePending}
              >
                {toEtherNumber(this.state.fundingBalance?.locked, 2, this.state.tradingPair.quote)}
                &nbsp;
                <span>{formatMessage({ id: 'locked' })}</span>
              </Placeholder>
            </div>

            <Row className={styles.actionLink} type="flex" justify="space-between">
              <Col>
                <Button type="link" onClick={() => address && this.depositVisible.show()}>
                  {formatMessage({ id: 'deposit' })}
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={() => address && this.withdrawVisible.show()}>
                  {formatMessage({ id: 'withdraw' })}
                </Button>
              </Col>
            </Row>
            <Row className={styles.radioBtn}>
              <Radio.Group value={tradeType} onChange={this.changeType}>
                <Radio.Button value="LONG" className={styles.green}>
                  {formatMessage({ id: 'order-type-long' })}
                </Radio.Button>
                <Radio.Button value="SHORT" className={styles.red}>
                  {formatMessage({ id: 'order-type-short' })}
                </Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>
              <Placeholder loading={loading}>
                Current Price: {format(curPrice)} {to}
              </Placeholder>
            </p>
            <p className={styles.amountTip}>{formatMessage({ id: 'amount' })}</p>
            <InputNumber
              className={styles.orderInput}
              onChange={this.onOpenAmountChange}
              placeholder={maxNumber ? `${formatMessage({ id: 'max' })} ${maxNumber}` : '0.00'}
              max={maxNumber}
              skip={true}
              showTag={true}
              tagClassName={styles.utilMax}
              suffix={from}
            />
            <p className={styles.settlement}>
              {formatMessage({ id: 'settlement-fee' })} :{' '}
              {setFeeQuery ? <Icon type="loading" /> : isNumberLike(fees?.settlementFee) ? fees?.settlementFee : 0} {to}
            </p>
            {/* <Progress strokeColor="#1346FF" showInfo={false} percent={30} strokeWidth={20} /> */}
            <Button
              loading={feeQuery}
              className={tradeType === 'SHORT' ? 'buttonRed' : 'buttonGreen'}
              type="primary"
              onClick={this.clickOpen}
            >
              {formatMessage({ id: 'order-action-open' })}
            </Button>

            <DespositModal
              coin={to}
              max={truncated(account && account.USDBalance ? account?.USDBalance[to] : undefined)}
              onCancel={this.depositVisible.hide}
              onConfirm={this.deposit}
              visible={depositVisible}
            />
            <WithdrawModal
              coin={to}
              onCancel={this.withdrawVisible.hide}
              onConfirm={this.withdraw}
              max={available}
              visible={withdrawVisible}
            />
            <OrderConfirm
              data={openData}
              fees={fees}
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
