import { Row, Col, Radio, Input, Progress, Button } from "antd";
import styles from "./style.module.less";
import DespositModal from "./modals/deposit";
import WithdrawModal from "./modals/withdraw";
import OrderConfirm from "./modals/order-confirm";
import { Component } from "react";
import SiteContext from "../../layouts/SiteContext";

const balance = "19.00";

export default class Balance extends Component {
  state = {
    depositVisible: false,
    withdrawVisible: false,
    orderConfirmVisible: false,
  };

  showDepositModal = () => {
    this.setState({
      depositVisible: true,
    });
  };

  closeDepositModal = () => {
    this.setState({
      depositVisible: false,
    });
  };

  showWithdrawModal = () => {
    this.setState({
      withdrawVisible: true,
    });
  };

  closeWithdrawModal = () => {
    this.setState({
      withdrawVisible: false,
    });
  };

  showOrderConfirmModal = () => {
    this.setState({
      orderConfirmVisible: true,
    });
  };

  closeOrderConfirmModal = () => {
    this.setState({
      orderConfirmVisible: false,
    });
  };

  render() {
    const { depositVisible, withdrawVisible, orderConfirmVisible } = this.state;

    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div
            className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}
          >
            <h2>
              Funding Balance<span>(USD)</span>
            </h2>
            <p className={styles.balanceVal}>{balance}</p>
            <div className={styles.dayChange}>
              24h&nbsp;<span>+1.58</span>
            </div>
            <Row
              className={styles.actionLink}
              type="flex"
              justify="space-between"
            >
              <Col>
                <Button type="link" onClick={this.showDepositModal}>
                  Deposit
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={this.showWithdrawModal}>
                  Withdraw
                </Button>
              </Col>
            </Row>
            <Row className={styles.radioBtn}>
              <Radio.Group defaultValue="Long">
                <Radio.Button value="Long">Long</Radio.Button>
                <Radio.Button value="Short">Short</Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>Current Price: 644.05 DAI</p>
            <p className={styles.amountTip}>Amount</p>
            <Input placeholder="0.00" suffix={"ETH"} />

            <Row className={styles.utilMax} type="flex" justify="space-between">
              <Col>Utilization: 20%</Col>
              <Col>Max Open:323.34 ETH</Col>
            </Row>

            <Progress percent={30} strokeWidth={20} />
            <p className={styles.settlement}>Settlements Fee : 0.00 DAI</p>
            <Button type="primary" onClick={this.showOrderConfirmModal}>
              Connect Wallet
            </Button>

            <DespositModal
              onCancel={this.closeDepositModal}
              visible={depositVisible}
            />
            <WithdrawModal
              onCancel={this.closeWithdrawModal}
              visible={withdrawVisible}
            />
            <OrderConfirm
              onCancel={this.closeOrderConfirmModal}
              visible={orderConfirmVisible}
            />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
