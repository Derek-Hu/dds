import { Component } from 'react';
import { Button, Table } from 'antd';
import styles from '../style.module.less';
import { getLiquidityLockedReward, getLiquiditorBalanceRecord, claimLiquidityLocked } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import { format } from '../../../util/math';
import ModalRender from '../../modal-render/index';
import ColumnConvert from '../../column-convert/index';
import dayjs from 'dayjs';

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
    const data = await getLiquidityLockedReward(this.context.account?.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });

    this.tableLoad();
  }

  tableLoad = async (page: number = 1) => {
    this.setState({ tableLoading: true });

    const tableData = await getLiquiditorBalanceRecord();
    this.setState({
      tableData,
    });
    this.setState({ tableLoading: false });
  };

  showWithDraw = () => {};
  showClaimModal = () => {};

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
      <Hidden when={loading}>
        <h3>{this.context.account?.address ? 'Your Liquidity Locked Rewards' : 'Liquidity Locked Rewards Today'}</h3>
        <p className={styles.coins}>{format(data)} DDS</p>
        <Auth>
          <p className={styles.dynamic}>
            <span>Only reward for liquidity locked in private pool</span>
          </p>
          <div>
            <Button type="primary" className={[styles.btn, styles.cliamBtn].join(' ')} onClick={this.cofirmClaim}>
              Claim
            </Button>
            <div>
              <Button type="link" onClick={this.visible.show} className={styles.recordLink}>
                Rewards Balance Record
              </Button>
            </div>
          </div>
        </Auth>

        <ModalRender
          visible={visible}
          title="Rewards Balance Record"
          className={styles.modal}
          height={420}
          onCancel={this.visible.hide}
          footer={null}
        >
          <Table scroll={{ y: 300, x: 500 }} columns={CommissionColumns} pagination={false} dataSource={tableData} />
        </ModalRender>
      </Hidden>
    );
  }
}
