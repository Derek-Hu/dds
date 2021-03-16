import { Table, Icon, Button } from 'antd';
import dayjs from 'dayjs';
import numeral from 'numeral';
import styles from './style.module.less';
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
    title: 'Friend Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Settlement Fee ($)',
    dataIndex: 'fee',
    key: 'fee',
    render: (time: string) => {
      return numeral(time).format('0,0');
    },
  },
  {
    title: 'Bonus Received(SLD)',
    dataIndex: 'bonus',
    key: 'bonus',
    render: (time: string) => {
      return numeral(time).format('0,0');
    },
  },
];

export interface IData {
  bonus: number;
  fee: number;
  address: string;
  time: number;
}
export default ({ data }: { data: IData[] }) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.tableList}>
          <h4>refeerals details</h4>
          <Table
            rowKey="coin"
            columns={columns}
            pagination={false}
            dataSource={data}
            scroll={isMobile ? { x: 600 } : undefined}
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
