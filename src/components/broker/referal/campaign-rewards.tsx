import { Component } from 'react';
import { Icon, Tabs, Row, Col, Input, Button, Table } from 'antd';
import CardInfo from '../../card-info/index';
import { getBrokerCampaignRewardData, getBrokerCampaignRewardsPool } from '../../../services/broker.service';
import ModalRender from '../../modal-render/index';
import ColumnConvert from '../../column-convert/index';
import dayjs from 'dayjs';
import styles from '../style.module.less';
import numeral from 'numeral';

interface IState {
  data: Array<{ label: string; value: any }>;
  loading: boolean;
  visible: boolean;
  tableLoading: boolean;
  tableData: Array<IBrokerCampaignRecord>;
}

const CommissionColumns = ColumnConvert<IBrokerCampaignRecord, {}>({
  column: {
    time: 'Time',
    pair: 'Friend Address',
    amount: 'Amount',
    price: 'Settlements Fee',
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
        return numeral(value).format('0,0.0000');
      default:
        return value;
    }
  },
});

export default class CampaignRewards extends Component<any, IState> {
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
    
    const data = await getBrokerCampaignRewardData();
    this.setState({
      data: data.map(({ value, coin }) => ({
        label: coin,
        value,
      })),
    });
    this.setState({ loading: false });

    const tableData = await getBrokerCampaignRewardsPool();
    this.setState({
        tableData
    });

  }

  render() {
    const { data, loading, visible, tableData } = this.state;
    return loading ? null : (
      <div>
        <CardInfo theme="inner" title="Campaign Rewards" items={data}>
          <Button type="link" onClick={this.visible.show}>
          Rewards Record
          </Button>
        </CardInfo>

        <ModalRender
          visible={visible}
          title="Rewards Record"
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
