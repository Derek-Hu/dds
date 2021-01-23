import FillGrid from "../../fill-grid/index";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import { CustomTabKey, SupportedCoins } from "../../../constant/index";
import styles from './style.module.less';

const { Option } = Select;

interface IProps {
  title: string;
}

const title = "Funding Deposit";

export default () => {
  return (
    <div>
      <h4>{title}</h4>
      <Row>
        <Select
          defaultValue="DAI"
          style={{ width: 120, height: 50 }}
        >
          {SupportedCoins.map((coin) => (
            <Option value={coin}>{coin}</Option>
          ))}
        </Select>
        <span className={styles.maxWithdraw}>
          Max Withdraw Balance: <span>3278392</span> DAI
        </span>
      </Row>
      <Row className={styles.repay}>
        <Input placeholder="Withdraw amount" />
        <p>XXX reDAI you need to pay</p>
      </Row>
    </div>
  );
};
