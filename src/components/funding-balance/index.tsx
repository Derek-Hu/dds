import { Row, Col, Radio, Input, Tag, Button } from "antd";
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
    isLogin: true,
    tradeType: 'Long'
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

  changeType = (e: any) => {
    console.log(e);
    this.setState({
      tradeType: e.target.value
    })
  }

  render() {
    const { depositVisible, withdrawVisible, orderConfirmVisible, tradeType } = this.state;

    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div
            className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}
          >
            <h2>
              Funding Balance<span>(DAI)</span>
            </h2>
            <p className={styles.balanceVal}>{balance}</p>
            <div className={styles.dayChange}>
              2&nbsp;<span>Locked</span>
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
              <Radio.Group defaultValue="Long" onChange={this.changeType}>
                <Radio.Button value="Long">Long</Radio.Button>
                <Radio.Button value="Short" className={styles.green}>Short</Radio.Button>
              </Radio.Group>
            </Row>
            <p className={styles.price}>Current Price: 644.05 DAI</p>
            <p className={styles.amountTip}>Amount</p>
            <Input placeholder="0.00" suffix={"ETH"} />

            <Row className={styles.utilMax} type="flex" justify="space-between">
              <Col span={12}><Tag color="#1346FF">Max</Tag></Col>
              <Col span={12} style={{textAlign: 'right'}}>323.34 ETH</Col>
            </Row>
            <p className={styles.settlement}>Settlements Fee : 0.00 DAI</p>
            {/* <Progress strokeColor="#1346FF" showInfo={false} percent={30} strokeWidth={20} /> */}
              <Button className={tradeType==='Short'? 'buttonGreen': ''} type="primary" onClick={this.showOrderConfirmModal}>
              Open
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
