import { Component } from 'react';
import { Icon, Tabs, Row, Col, Input, Button, Table } from 'antd';
import CardInfo from '../../card-info/index';
import { getBrokerCommissionData, getBrokerCommissionRecords } from '../../../services/broker.service';
import ModalRender from '../../modal-render/index';
import ColumnConvert from '../../column-convert/index';
import dayjs from 'dayjs';
import styles from '../style.module.less';
import { format } from '../../../util/math';
import { SupporttedUSD } from '../../../constant/index';

interface IState {
  data: Array<{ label: string; value: any }>;
  loading: boolean;
  visible: boolean;
  tableLoading: boolean;
  tableData: Array<IBrokerCommissionRecord>;
}

const CommissionColumns = ColumnConvert<IBrokerCommissionRecord, {}>({
  column: {
    time: 'Time',
    pair: 'Friend Address',
    amount: 'Amount',
    price: 'Settlement Fee',
    reward: 'Commission',
  },
  render(value, key, record) {
    switch (key) {
      case 'time':
        return dayjs(value).format('YYYY-MM-DD');
      case 'pair':
        const { from, to } = record[key];
        return from + '/' + to;
      case 'amount':
      case 'price':
      case 'reward':
        return format(value);
      default:
        return value;
    }
  },
});

export default class CommissionPool extends Component<any, IState> {
  state: IState = {
    data: [],
    loading: false,
    visible: false,
    tableLoading: false,
    tableData: [],
  };

  setModalVisible = (key: 'visible') => {
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

  visible = this.setModalVisible('visible');

  async componentDidMount() {
    this.setState({ loading: true });

    const data = await getBrokerCommissionData();
    this.setState({
      data: data.map(({ value, coin }) => ({
        label: coin,
        value,
      })),
    });
    this.setState({ loading: false });

    // this.tableLoad();
  }

  tableLoad = async (page: number = 1) => {
    this.setState({ tableLoading: true });

    const tableData = await getBrokerCommissionRecords();
    this.setState({
      tableData,
    });
    this.setState({ tableLoading: false });
  };

  render() {
    const { data, loading, visible, tableData } = this.state;

    const dataInfo = (data || []).reduce((total, item) => {
      // @ts-ignore
      total[item.label] = item.value;
      return total;
    }, {});

    // @ts-ignore
    const coins = Object.keys(SupporttedUSD).map(coin => ({
      label: coin,
      // @ts-ignore
      value: dataInfo[coin],
    }));

    return (
      <div>
        <CardInfo loading={loading} theme="inner" title="Commission" items={coins}>
          {/* <Button type="link" onClick={this.visible.show}>
            Commission History
          </Button> */}
        </CardInfo>

        <ModalRender
          visible={visible}
          title="Commission History"
          className={styles.modal}
          height={420}
          onCancel={this.visible.hide}
          footer={null}
        >
          <Table scroll={{ y: 300, x: 500 }} columns={CommissionColumns} pagination={false} dataSource={tableData} />
        </ModalRender>
      </div>
    );
  }
}
