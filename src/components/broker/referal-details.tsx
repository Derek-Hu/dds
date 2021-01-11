import { Table, Icon, Button } from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import styles from "./style.module.less";

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (time: string) => {
      return dayjs(time).format("YYYY-MM-DD");
    },
  },
  {
    title: "Friend Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Settlements Fee ($)",
    dataIndex: "fee",
    key: "fee",
    render: (time: string) => {
      return numeral(time).format("0,0");
    },
  },
  {
    title: "Bonus Received(DDS)",
    dataIndex: "bonus",
    key: "bonus",
    render: (time: string) => {
      return numeral(time).format("0,0");
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
    <div className={styles.tableList}>
      <h4>refeerals details</h4>
      <Table
        rowKey="coin"
        columns={columns}
        pagination={false}
        dataSource={data}
      />
      <Button type="link" className={styles.more}>More&nbsp;<Icon type="down" /></Button>
    </div>
  );
};
