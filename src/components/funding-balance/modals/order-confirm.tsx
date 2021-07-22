import { Descriptions, Row, Col, message } from 'antd';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
import SiteContext from '../../../layouts/SiteContext';
import { formatMessage } from 'locale/i18n';
import { BaseStateComponent } from '../../../state-manager/base-state-component';
import { P } from '../../../state-manager/page/page-state-parser';
import { S } from '../../../state-manager/contract/contract-state-parser';
import { BigNumber } from 'ethers';
import { toEtherNumber } from '../../../util/ethers';
import NormalButton from '../../common/buttons/normal-btn';
import { isGreaterZero } from '../../../util/math';
import { PageTradingPair, TradeDirection, TradeOrderFees } from '../../../state-manager/state-types';

const title = formatMessage({ id: 'order-confirm' });

interface IProps {
  onConfirm: () => any;
}

type IState = {
  visible: boolean;
  openOrderFees: TradeOrderFees | null;
  openOrderFeesPending: boolean;
  tradingPair: PageTradingPair;
  tradingDirection: TradeDirection;
  openAmount: number;
  maxOpenAmount: BigNumber | null;
};

export default class OrderConfirm extends BaseStateComponent<IProps, IState> {
  state: IState = {
    visible: false,
    openOrderFees: null,
    openOrderFeesPending: false,
    tradingPair: P.Trade.Pair.get(),
    tradingDirection: P.Trade.Direction.get(),
    openAmount: P.Trade.Create.OpenAmount.get(),
    maxOpenAmount: null,
  };

  componentDidMount() {
    this.registerState('openOrderFees', S.Trade.Create.CurOpenOrderFee);
    this.registerStatePending('openOrderFeesPending', S.Trade.Create.CurOpenOrderFee);
    this.registerState('maxOpenAmount', S.Trade.Create.CurMaxOpenAmount);
    this.registerState('tradingPair', P.Trade.Pair);
    this.registerState('tradingDirection', P.Trade.Direction);
    this.registerState('openAmount', P.Trade.Create.OpenAmount);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  quoteCoinNum(num: BigNumber | null | undefined, dft = '--'): string {
    if (num === null || num === undefined) {
      return dft;
    }
    return toEtherNumber(num, 2, this.state.tradingPair.quote);
  }

  baseCoinNum(num: BigNumber | null | undefined, dft = '--'): string {
    if (num === null || num === undefined) {
      return dft;
    }
    return toEtherNumber(num, 2, this.state.tradingPair.base);
  }

  feeNum(num: BigNumber | null | undefined): string {
    return toEtherNumber(num, 3, this.state.tradingPair.quote);
  }

  onCancel() {
    this.setState({ visible: false });
  }

  onShowConfirm() {
    const openAmount: number = P.Trade.Create.OpenAmount.get();
    if (!isGreaterZero(openAmount)) {
      return;
    }

    const maxAmount: number = Number(this.baseCoinNum(this.state.maxOpenAmount, '0'));

    if (maxAmount < openAmount) {
      message.warning(formatMessage({ id: 'more-balance-required-deposit-first' }));
      return;
    }

    S.Trade.Create.CurOpenOrderFee.tick();
    this.setState({ visible: true });
  }

  onConfirmCreateOrder() {
    this.onCancel();
    this.props.onConfirm();
  }

  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <>
            <NormalButton
              type={'primary'}
              marginTop={'0px'}
              bgColor={this.state.tradingDirection === 'SHORT' ? '#f55858' : '#15b384'}
              onClick={this.onShowConfirm.bind(this)}
            >
              {formatMessage({ id: 'order-action-open' })}
            </NormalButton>

            <ModalRender
              visible={this.state.visible}
              height={390}
              onCancel={this.onCancel.bind(this)}
              footer={null}
              title={title}
              className={styles.commonModal}
            >
              <Descriptions column={1} colon={false}>
                <Descriptions.Item label="Type">{this.state.tradingDirection}</Descriptions.Item>
                <Descriptions.Item label="Open Price">
                  {this.quoteCoinNum(this.state.openOrderFees?.curPrice)}
                  {this.state.tradingPair.quote.description}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  {this.state.openAmount} {this.state.tradingPair.base.description}
                </Descriptions.Item>
                <Descriptions.Item label="Funding Fee Lock">
                  {this.feeNum(this.state.openOrderFees?.fundingLocked)} {this.state.tradingPair.quote.description}
                </Descriptions.Item>
                <Descriptions.Item label="Settlement Fee">
                  {this.feeNum(this.state.openOrderFees?.settlementFee)} {this.state.tradingPair.quote.description}
                </Descriptions.Item>
              </Descriptions>

              <Row gutter={[isMobile ? 0 : 16, 16]} className={styles.actionBtns} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <NormalButton type={'default'} onClick={this.onCancel.bind(this)} inModal={true}>
                    {formatMessage({ id: 'cancel' })}
                  </NormalButton>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <NormalButton type={'primary'} onClick={this.onConfirmCreateOrder.bind(this)} inModal={true}>
                    {formatMessage({ id: 'confirm' })}
                  </NormalButton>
                </Col>
              </Row>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
