import SwapBar from "./swap-bar";
import styles from "./style.module.less";
import { Button, Select, Form, Icon, Input } from "antd";
import numeral from "numeral";

const { Option } = Select;

const swapInfo = {
  dds: 1078,
  coin: 21087.46,
  unit: "DAI",
};
export default () => {
  // return <SwapBar></SwapBar>
  return (
    <div className={styles.root}>
      <h1>Swap &apm; burn</h1>
      <div className={styles.card}>
        <div className={styles.imgBar}>

        </div>
        <h3 className={styles.msg}>Current Swap Price</h3>
        <p className={styles.calcute}>
          {numeral(swapInfo.coin).format("0,0")} USD ={" "}
          {numeral(swapInfo.dds).format("0,0")} DDS
        </p>
        <div className={styles.swapContainer}>
        <Form className="login-form">
          <Form.Item>
            <Input
              className={styles.ddsInput}
              placeholder="How many DDS do you want to swap and burn?"
            />
            <span className={styles.unit}>DDS</span>
          </Form.Item>
          <Form.Item>
            <div className={styles.row}>
              <div className={styles.leftCol}>
                <span className={styles.swap}>
                  <Icon type="swap" />
                </span>
                <Select
                  defaultValue="lucy"
                  style={{ width: 120, height: 50 }}
                  className={styles.coinDropdown}
                  // onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </div>
              <div className={styles.rightCol}>
                <Input placeholder="" />
              </div>
              <span className={styles.targetUnit}>DAI</span>
            </div>
          </Form.Item>
          <Form.Item className={styles.lastRow}>
            <Button type="primary">Connect Wallet</Button>
          </Form.Item>
        </Form>
      </div>
      </div>
    </div>
  );
};
