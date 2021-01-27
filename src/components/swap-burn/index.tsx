import { Component } from "react";
import SwapBar from "./swap-bar";
import styles from "./style.module.less";
import {
  Button,
  Select,
  Form,
  Icon,
  Input,
  Row,
  Col,
  Descriptions,
} from "antd";
import numeral from "numeral";
import FillGrid from "../fill-grid";
import ModalRender from "../modal-render/index";
import commonStyles from "../funding-balance/modals/style.module.less";

const { Option } = Select;

const swapInfo = {
  dds: 1078,
  coin: 21087.46,
  unit: "DAI",
};
export default class PoolArea extends Component<{ isLogin: boolean }, any> {
  state = {
    swapModalVisible: false,
  };

  closeSwapModal = () => {
    this.setState({
      swapModalVisible: false,
    });
  };

  showSwapModal = () => {
    this.setState({
      swapModalVisible: true,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <h1>Swap & burn</h1>
        <div className={styles.card}>
          <div className={styles.imgBar}>
            <SwapBar></SwapBar>
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
                <FillGrid
                  left={
                    <>
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
                    </>
                  }
                  right={<Input placeholder="" />}
                >
                  <span className={styles.targetUnit}>DAI</span>
                </FillGrid>
              </Form.Item>
              <Form.Item className={styles.lastRow}>
                <Button type="primary" onClick={this.showSwapModal}>
                  Connect Wallet
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <ModalRender
          visible={this.state.swapModalVisible}
          title="Order Comfirm"
          className={commonStyles.commonModal}
          onCancel={this.closeSwapModal}
          footer={null}
        >
          <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
            <Descriptions.Item label="Swap Ratio" span={24}>
              1DDS : 644.05 DAI
            </Descriptions.Item>
            <Descriptions.Item label="Swap Amount" span={24}>
              10 DDS
            </Descriptions.Item>
            <Descriptions.Item label="Receive" span={24}>
              6440.5 DAI
            </Descriptions.Item>
          </Descriptions>
          <Row className={commonStyles.actionBtns} gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Button>Cancel</Button>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Button type="primary">Comfirm</Button>
            </Col>
          </Row>
        </ModalRender>
      </div>
    );
  }
}
