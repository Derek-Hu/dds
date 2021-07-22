import { BaseStateComponent } from '../../state-manager/base-state-component';
import { OrderItemData, OrderStatus, TradeDirection } from '../../state-manager/state-types';
import { formatMessage } from 'locale/i18n';
import { formatTime } from '../../util/time';
import { BigNumber } from 'ethers';
import { format } from '../../util/math';
import { toRoundNumber } from '../../util/ethers';
import { Table } from 'antd';
import tables from './table-common.module.less';
import { D } from '../../state-manager/database/database-state-parser';
import { TableLoading } from './table-loading';
import { TableMore } from './table-more';
import { P } from '../../state-manager/page/page-state-parser';

type IProps = {};
type IState = {
  datasource: OrderItemData[] | undefined;
  hasMore: boolean;
  loadingMore: boolean;
};

export class HistoryOrderTable extends BaseStateComponent<IProps, IState> {
  state: IState = {
    datasource: undefined,
    hasMore: false,
    loadingMore: false,
  };

  columns = [
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
      title: formatMessage({ id: 'close-price' }),
      dataIndex: 'closePrice',
      key: 'closePrice',
      render: (price: BigNumber, row: OrderItemData) =>
        format(toRoundNumber(price, 2, row.quoteSymbol)) + ` (${row.quoteSymbol.description})`,
    },
    {
      title: formatMessage({ id: 'funding-fee-cost' }),
      dataIndex: 'fundingFee',
      key: 'fundingFee',
      render: (fee: BigNumber, row: OrderItemData) => {
        return format(toRoundNumber(fee, 2, row.quoteSymbol)) + ` (${row.quoteSymbol.description})`;
      },
    },
    {
      title: formatMessage({ id: 'settlement-fee' }),
      dataIndex: 'settlementFee',
      key: 'settlementFee',
      render: (fee: BigNumber, row: OrderItemData) => {
        return format(toRoundNumber(fee, 2, row.quoteSymbol)) + ` (${row.quoteSymbol.description})`;
      },
    },
    {
      title: formatMessage({ id: 'realized-profit' }),
      dataIndex: 'realizedProfit',
      key: 'realizedProfit',
      render: (profit: number, row: OrderItemData) => {
        return (
          <span className={profit < 0 ? tables.negative : tables.positive}>
            {format(profit) + ` (${row.quoteSymbol.description})`}
          </span>
        );
      },
    },
    {
      title: formatMessage({ id: 'status' }),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: OrderStatus) => status,
    },
  ];

  componentDidMount() {
    this.registerState('datasource', D.HistoryOrders, () => {
      const max: number = (P.Trade.Orders.History.PageIndex.get() + 1) * P.Trade.Orders.History.PageSize.get();
      const hasMore: boolean = !!this.state.datasource && this.state.datasource.length === max;
      this.setState({
        hasMore: hasMore,
        loadingMore: false,
      });
    });

    this.tickInterval(5000, D.HistoryOrders);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  onDisplayMore() {
    this.setState({ loadingMore: true }, () => {
      P.Trade.Orders.History.PageIndex.set(P.Trade.Orders.History.PageIndex.get() + 1);
    });
  }

  render() {
    return (
      <div className={tables.sldTable}>
        {this.state.datasource === undefined ? (
          <TableLoading />
        ) : (
          <Table
            dataSource={this.state.datasource}
            columns={this.columns}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        )}
        <TableMore show={this.state.hasMore} loading={this.state.loadingMore} onClick={this.onDisplayMore.bind(this)} />
      </div>
    );
  }
}
