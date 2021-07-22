import { BaseStateComponent } from '../../state-manager/base-state-component';
import { formatMessage } from 'locale/i18n';
import { formatTime } from '../../util/time';
import { OrderItemData, TradeDirection } from '../../state-manager/state-types';
import styles from './active-order-table.module.less';
import tables from './table-common.module.less';
import { Button, Col, Descriptions, Row, Table } from 'antd';
import { D } from '../../state-manager/database/database-state-parser';
import { toRoundNumber } from '../../util/ethers';
import { BigNumber } from 'ethers';
import { format } from '../../util/math';
import { ColumnProps } from 'antd/lib/table/interface';
import ModalRender from '../modal-render/index';
import { toCamelCase } from '../../util/string';
import { Observable } from 'rxjs';
import { S } from '../../state-manager/contract/contract-state-parser';
import { TRADE_PAIR_SYMBOL } from '../../constant/tokens';
import { map } from 'rxjs/operators';
import { computePositionPNL } from '../../util/pnl';
import NormalButton from '../common/buttons/normal-btn';
import { closeOrder } from '../../services/trade.service';
import Placeholder from '../placeholder';
import { TableLoading } from './table-loading';

type IProps = {};
type IState = {
  datasource: any[] | undefined;
  closeOrder: OrderItemData | null;
  closeInfo: CloseConfirmInfo | null;
  showCloseConfirmModal: boolean;
};
type CloseConfirmInfo = {
  tradeDirection: TradeDirection;
  openPrice: number;
  openAmount: number;
  closePrice: number;
  pnlVal: number;
  pnlPercent: number;
  quote: symbol;
  base: symbol;
};

export class ActiveOrderTable extends BaseStateComponent<IProps, IState> {
  state: IState = {
    datasource: undefined,
    closeOrder: null,
    closeInfo: null,
    showCloseConfirmModal: false,
  };

  columns: ColumnProps<any>[] = [
    {
      title: formatMessage({ id: 'time' }),
      dataIndex: 'openTime',
      key: 'openTime',
      render: (timestamp: string | number) => formatTime(timestamp),
    },
    {
      title: formatMessage({ id: 'type' }),
      dataIndex: 'tradeDirection',
      key: 'tradeDirection',
      render: (type: TradeDirection) => (
        <span className={type === 'LONG' ? tables.tradeLong : tables.tradeShort}>{type}</span>
      ),
    },
    {
      title: formatMessage({ id: 'open-price' }),
      dataIndex: 'openPrice',
      key: 'openPrice',
      render: (price: BigNumber, row: OrderItemData) => format(toRoundNumber(price, 2, row.quoteSymbol)),
    },
    {
      title: formatMessage({ id: 'amount' }),
      dataIndex: 'openAmount',
      key: 'openAmount',
      render: (amount: BigNumber, row: OrderItemData) =>
        format(toRoundNumber(amount, 2, row.baseSymbol)) + ` (${row.baseSymbol.description})`,
    },
    {
      title: formatMessage({ id: 'funding-fee-locked' }),
      dataIndex: 'fundingFee',
      key: 'fundingFee',
      render: (fundingFee: BigNumber, row: OrderItemData) =>
        format(toRoundNumber(fundingFee, 2, row.quoteSymbol)) + ` (${row.quoteSymbol.description})`,
    },
    {
      title: formatMessage({ id: 'settlement-fee' }),
      dataIndex: 'settlementFee',
      key: 'settlementFee',
      render: (settlementFee: BigNumber, row: OrderItemData) =>
        format(toRoundNumber(settlementFee, 2, row.quoteSymbol)) + ` (${row.quoteSymbol.description})`,
    },
    {
      title: formatMessage({ id: 'P&L' }),
      dataIndex: 'positionPNLVal',
      key: 'positionPNLVal',
      render: (pnl: number, row: OrderItemData) =>
        pnl > 0 ? (
          <>
            <span>{pnl}</span>
            <span>
              &nbsp; (<span className={pnl > 0 ? tables.positive : tables.negative}>{row.positionPNLPercent}%</span>)
            </span>
          </>
        ) : (
          <span>0</span>
        ),
    },
    {
      title: formatMessage({ id: 'status' }),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text: string) => text,
    },
    {
      title: formatMessage({ id: 'action' }),
      dataIndex: '',
      key: '',
      render: (text: string, row: OrderItemData) =>
        row.orderStatus === 'ACTIVE' ? (
          <Button type="link" onClick={() => this.onClosePosition(row)}>
            {formatMessage({ id: 'close' })}
          </Button>
        ) : null,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    this.registerState('datasource', D.ActiveOrders);
    this.tickInterval(5000, D.ActiveOrders);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  onClosePosition(order: OrderItemData) {
    this.genCloseInfo(order).subscribe((closeInfo: CloseConfirmInfo) => {
      this.setState({ closeOrder: order, closeInfo }, () => {
        this.setState({ showCloseConfirmModal: true });
      });
    });
  }

  onCloseOrder() {
    if (this.state.closeOrder) {
      this.hideCloseModal();
      closeOrder(this.state.closeOrder).then(() => {
        this.tickState(D.ActiveOrders);
      });
    }
  }

  hideCloseModal() {
    this.setState({ showCloseConfirmModal: false });
  }

  private genCloseInfo(order: OrderItemData): Observable<CloseConfirmInfo> {
    return S.Trade.Price[order.pairSymbol.description as keyof typeof TRADE_PAIR_SYMBOL].get().pipe(
      map((closePrice: BigNumber) => {
        const openPrice: number = Number(toRoundNumber(order.openPrice, 2, order.quoteSymbol));
        const openAmount: number = Number(toRoundNumber(order.openAmount, 2, order.baseSymbol));
        const { pnl, percent } = computePositionPNL(order.openPrice, closePrice, order.openAmount, order.pairSymbol);
        return {
          tradeDirection: order.tradeDirection,
          openPrice,
          openAmount,
          closePrice: Number(toRoundNumber(closePrice, 2, order.baseSymbol)),
          pnlVal: pnl,
          pnlPercent: percent,
          quote: order.quoteSymbol,
          base: order.baseSymbol,
        } as CloseConfirmInfo;
      })
    );
  }

  render() {
    return (
      <>
        <div className={tables.sldTable}>
          {this.state.datasource === undefined ? (
            <TableLoading />
          ) : (
            <Table
              columns={this.columns}
              dataSource={this.state.datasource}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </div>

        <ModalRender
          visible={this.state.showCloseConfirmModal}
          footer={null}
          title={formatMessage({ id: 'close-position' })}
          onCancel={this.hideCloseModal.bind(this)}
        >
          <Descriptions column={1} colon={false} className={styles.modalItem}>
            <Descriptions.Item label={formatMessage({ id: 'type' })}>
              {toCamelCase(this.state.closeInfo?.tradeDirection)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'open-price' })}>
              {format(this.state.closeInfo?.openPrice)} {this.state.closeInfo?.quote.description}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'amount' })}>
              {format(this.state.closeInfo?.openAmount)} {this.state.closeInfo?.base.description}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'close-price' })}>
              {format(this.state.closeInfo?.closePrice)} {this.state.closeInfo?.quote.description}
            </Descriptions.Item>

            <Descriptions.Item label={formatMessage({ id: 'P&L' })}>
              {this.state.closeInfo?.pnlVal} ({this.state.closeInfo?.pnlPercent}%)
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <NormalButton type={'default'} inModal={true} onClick={this.hideCloseModal.bind(this)}>
                {formatMessage({ id: 'cancel' })}
              </NormalButton>
            </Col>
            <Col span={12}>
              <NormalButton type={'primary'} inModal={true} onClick={this.onCloseOrder.bind(this)}>
                {formatMessage({ id: 'close' })}
              </NormalButton>
            </Col>
          </Row>
        </ModalRender>
      </>
    );
  }
}
