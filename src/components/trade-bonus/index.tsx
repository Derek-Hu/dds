import { Table } from "antd";
import ColumnConvert from "../column-convert/index";
import numeral from "numeral";
import Decimal from "decimal.js";
import dayjs from "dayjs";
import styles from "./style.module.less";

type IStatus = "ACTIVE" | "CLOSED" | "LIQUIDATING";

export interface IRecord {
  id: string;
  time: number;
  type: string;
  price: number;
  size: number;
  cost: number;
  fee: number;
  pl: {
    val: number;
    percentage: number;
  };
  status: IStatus;
  exercise?: any;
}

const statusColor: { [key in IStatus]: string } = {
  ACTIVE: "#333333",
  CLOSED: "#333333",
  LIQUIDATING: "#FA4D56",
};
const columns = ColumnConvert<IRecord, {}>({
  column: {
    time: "Time",
    type: "Type",
    price: "Order Price",
    size: "Size",
    cost: "Funding Cost ($)",
    fee: "Settlements Fee ($)",
    pl: "P&L",
    status: "Status",
    exercise: "Exercise",
  },
  render(value, key, record) {
    switch (key) {
      case "time":
        return dayjs(value).format("YYYY-MM-DD");
      case "price":
      case "size":
      case "cost":
      case "fee":
        return numeral(value).format("0,0");
      case "pl":
        const { val, percentage } = record[key];
        const flag =
          percentage === 0 ? (
            ""
          ) : percentage < 0 ? (
            <span>-</span>
          ) : (
            <span>+</span>
          );
        const color =
          percentage === 0 ? "#383838" : percentage < 0 ? "#FA4D56" : "#02B464";
        return (
          <span>
            {numeral(val).format("0,0")}
            <span style={{ color }}>
              ({flag}
              {new Decimal(Math.abs(percentage)).times(100).toString()}%)
            </span>
          </span>
        );
      case "status":
        const status = record[key];
        return <span style={{ color: statusColor[status] }}>{status}</span>;
      case "type":
        const buyShort = record[key];
        return (
          <span
            style={{
              color:
                buyShort === "Buy"
                  ? "#02B464"
                  : buyShort === "Buy"
                  ? "#FA4D56"
                  : "#383838",
            }}
          >
            {buyShort}
          </span>
        );
      default:
        return value;
    }
  },
});
export default ({ data }: { data: IRecord[] }) => {
  return (
    <div className={styles.root}>
      <h2>Trading Bonus</h2>
      <div className={styles.tableWpr}>
        <Table
          rowKey="id"
          columns={columns}
          pagination={false}
          dataSource={data}
        />
      </div>
    </div>
  );
};
