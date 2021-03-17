import { Table, Icon, Button } from 'antd';
import dayjs from 'dayjs';
import numeral from 'numeral';
import styles from './locked.module.less';
import SiteContext from '../../layouts/SiteContext';

const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (time: string) => {
      return dayjs(time).format('YYYY-MM-DD');
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Liquidity Locked',
    dataIndex: 'locked',
    key: 'locked',
    render: (time: string) => {
      return numeral(time).format('0,0');
    },
  },
  // {
  //   title: 'Settlement Fee',
  //   dataIndex: 'fee',
  //   key: 'fee',
  //   render: (time: string) => {
  //     return numeral(time).format('0,0');
  //   },
  // },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Strike Price',
    dataIndex: 'operate',
    key: 'operate',
    // render: (time: string) => {
    //   return <Button type="primary">增加补仓</Button>;
    // },
  },
  {
    title: 'Action',
    key: 'action',
    render: () => {
      return <Button type="link">ADD MARGIN</Button>;
    },
  },
];

export interface ILockedData {
  size: number;
  locked: number;
  fee: number;
  reward: number;
  time: number;
  status: string;
}
export default ({ data }: { data: ILockedData[] }) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.tableList}>
          <h4>Liquidity Locked Detail</h4>
          <Table
            rowKey="coin"
            columns={columns}
            pagination={false}
            dataSource={data}
            scroll={isMobile ? { x: 800 } : undefined}
          />
          <Button type="link" className={styles.more}>
            More&nbsp;
            <Icon type="down" />
          </Button>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
