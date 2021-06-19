import { Table, Icon, Button } from 'antd';
import { formatTime } from '../../util/time';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { format } from '../../util/math';
import { formatMessage } from '~/util/i18n';

const columns = [
  {
    title: formatMessage({ id: 'time' }),
    dataIndex: 'time',
    key: 'time',
    render: (time: string) => {
      return formatTime(time);
    },
  },
  {
    title: formatMessage({ id: 'friend-address' }),
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: formatMessage({ id: 'settlement-fee-dollar' }),
    dataIndex: 'fee',
    key: 'fee',
    render: (time: string) => {
      return format(time);
    },
  },
  {
    title: formatMessage({ id: 'bonus-recieved-sld' }),
    dataIndex: 'bonus',
    key: 'bonus',
    render: (time: string) => {
      return format(time);
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
          <h4>{formatMessage({ id: 'refeerals-details' })}</h4>
          <Table
            rowKey="coin"
            columns={columns}
            pagination={false}
            dataSource={data}
            scroll={isMobile ? { x: 600 } : undefined}
          />
          <Button type="link" className={styles.more}>
            {formatMessage({ id: 'more' })}&nbsp;
            <Icon type="down" />
          </Button>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
