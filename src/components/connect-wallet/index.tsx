import { Component } from "react";
import { Select, Row, Col, Button } from "antd";
import styles from "./style.module.less";
import SiteContext from "../../layouts/SiteContext";
import ModalRender from "../modal-render/index";
import commonStyles from "../funding-balance/modals/style.module.less";

const { Option } = Select;

const SupporttedWallets = ["Metamask", "Wallet Connect"];
export default class ConnectWallet extends Component<any, any> {
  state = {
    visible: false,
    isConnected: false,
    walletType: "Metamask",
  };

  switchWallet = (walletType: string) => {
    this.setState({
      walletType,
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  closeDepositModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, isConnected, walletType } = this.state;
    const { children } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div className={styles.root}>
            <span onClick={this.showModal}>{children}</span>
            <ModalRender
              visible={visible}
              title="Connect Wallet"
              className={commonStyles.commonModal}
              onCancel={this.closeDepositModal}
              height={300}
              width={500}
              footer={null}
            >
              <Row gutter={[16, 24]} type="flex" className={styles.coinList}>
                {SupporttedWallets.map((name) => (
                  <Col
                    key={name}
                    span={24}
                    className={walletType === name ? styles.active : ""}
                  >
                    <Button onClick={() => this.switchWallet(name)}>
                      {name}
                    </Button>
                  </Col>
                ))}
                {isConnected ? (
                  <Col span={24}>
                    <Select
                      defaultValue="0x43278r9eifkdss"
                      style={{ width: "100%", height: 50 }}
                    >
                      <Option value="0x43278r9eifkdss">0x43278r9eifkdss</Option>
                      <Option value="0x4327ewdsifkdss">0x4327ewdsifkdss</Option>
                    </Select>
                  </Col>
                ) : null}
                <Col span={24}>
                  {isConnected ? (
                    <Button type="primary">Disconnect Wallet</Button>
                  ) : (
                    <Button type="primary">Connect Wallet</Button>
                  )}
                </Col>
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
