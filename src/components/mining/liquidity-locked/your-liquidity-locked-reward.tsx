import { Component } from 'react';
import { Button, Table } from 'antd';
import styles from '../style.module.less';
import {
  getLiquidityLockedReward,
  getLiquiditorBalanceRecord,
  claimLiquidityLocked,
} from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';
import ModalRender from '../../modal-render/index';
import ColumnConvert from '../../column-convert/index';
import dayjs from 'dayjs';
import Placeholder from '../../placeholder/index';

interface IState {
  loading: boolean;
  data?: number;
  tableLoading: boolean;
  visible: boolean;
  tableData: ILiquiditorBalanceRecord[];
}

const CommissionColumns = ColumnConvert<ILiquiditorBalanceRecord, {}>({
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

export default class LiquiditorReward extends Component<any, IState> {
  state: IState = {
    loading: false,
    visible: false,
    tableLoading: false,
    tableData: [],
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getLiquidityLockedReward(this.context.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });

    // this.tableLoad();
  }

  tableLoad = async (page: number = 1) => {
    this.setState({ tableLoading: true });

    const tableData = await getLiquiditorBalanceRecord();
    this.setState({
      tableData,
    });
    this.setState({ tableLoading: false });
  };

  cofirmClaim = async () => {
    await claimLiquidityLocked();
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

  render() {
    const { data, loading, visible, tableData } = this.state;
    return (
      <div>
        <h3>{this.context.address ? 'Your Active Liquidity Reward' : 'Active Liquidity Reward Today'}</h3>
        <p className={styles.coins}>
          <Placeholder loading={loading} width={'10em'}>
            {format(data)} SLD
          </Placeholder>
        </p>
        <Auth>
          <p className={styles.dynamic}>
            <span>Only reward for liquidity locked</span>
          </p>
          <div>
            <Placeholder loading={loading} width={'10em'}>
              <Button type="primary" className={[styles.btn, styles.cliamBtn].join(' ')} onClick={this.cofirmClaim}>
                CLAIM
              </Button>
            </Placeholder>
            {/* <div>
              <Button type="link" onClick={this.visible.show} className={styles.recordLink}>
              Rewards Balance History
              </Button>
            </div> */}
          </div>
        </Auth>

        <ModalRender
          visible={visible}
          title="Rewards Balance History"
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
