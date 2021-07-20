import { BaseStateComponent } from '../../state-manager/base-state-component';
import { formatMessage } from 'locale/i18n';
import { formatTime } from '../../util/time';
import { TradeDirection } from '../../state-manager/state-types';
import styles from './active-order-table.module.less';
import { Table } from 'antd';

type IProps = {};
type IState = { datasource: any[] | undefined };

export class ActiveOrderTable extends BaseStateComponent<IProps, IState> {
  state: IState = {
    datasource: undefined,
  };

  columns = [
    {
      title: formatMessage({ id: 'time' }),
      dataIndex: 'time',
      key: 'time',
      render: (timestamp: string | number) => formatTime(timestamp),
    },
    {
      title: formatMessage({ id: 'type' }),
      dataIndex: 'tradeDirection',
      key: 'tradeDirection',
      render: (type: TradeDirection) => (
        <span className={type === 'LONG' ? styles.tradeLong : styles.tradeShort}>{type}</span>
      ),
    },
    {
      title: formatMessage({ id: 'open-price' }),
      dataIndex: 'openPrice',
      key: 'openPrice',
      render: (price: number) => price.toString(),
    },
    {
      title: formatMessage({ id: 'amount' }),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toString(),
    },
    {
      title: formatMessage({ id: 'funding-fee-locked' }),
      dataIndex: 'fundingFee',
      key: 'fundingFee',
      render: (text: string) => text,
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (text: string) => text,
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (text: string) => text,
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (text: string) => text,
    },
  ];

  componentDidMount() {}

  componentWillUnmount() {
    this.destroyState();
  }

  render() {
    return <Table columns={this.columns} dataSource={this.state.datasource} />;
  }
}
