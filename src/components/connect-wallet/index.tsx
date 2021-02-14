import { Component } from 'react';
import { Select, Row, Col, Button } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import { metamaskWallet } from '../../wallet/metamask';
import { Subscription } from 'rxjs';

const { Option } = Select;
const SupporttedWallets = ['Metamask', 'Wallet Connect'];

export default class ConnectWallet extends Component<any, any> {
  state = {
    visible: false,
    isConnected: false,
    walletType: 'Metamask',
    account: undefined,
  };

  private accSub: Subscription | null = null;

  componentDidMount = () => {
    this.watchWalletAccount();
  };

  componentWillUnmount() {
    this.unWatchWalletAccount();
  }

  switchWallet = (walletType: string) => {
    this.setState(
      {
        walletType,
        isConnected: false,
      },
      () => this.watchWalletAccount()
    );
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

  connectWallet = () => {
    if (this.state.isConnected) {
      return;
    }

    switch (this.state.walletType) {
      case 'Metamask': {
        metamaskWallet.doConnect();
        break;
      }
      default: {
      }
    }
  };

  unWatchWalletAccount() {
    if (this.accSub) {
      this.accSub.unsubscribe();
    }
  }

  watchWalletAccount() {
    this.unWatchWalletAccount();

    switch (this.state.walletType) {
      case 'Metamask': {
        this.accSub = metamaskWallet
          .watchAccount()
          .subscribe((account: string | null) => {
            this.setState({
              isConnected: account !== null,
              account,
            });
          });
        break;
      }
      default: {
      }
    }
  }

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
                    className={walletType === name ? styles.active : ''}
                  >
                    <Button onClick={() => this.switchWallet(name)}>
                      {name}
                    </Button>
                  </Col>
                ))}
                {isConnected ? (
                  <Col span={24}>
                    <Select
                      defaultValue={this.state.account}
                      value={this.state.account}
                      style={{ width: '100%', height: 50 }}
                    >
                      <Option value={this.state.account}>
                        {this.state.account}
                      </Option>
                    </Select>
                  </Col>
                ) : null}
                <Col span={24}>
                  {isConnected ? (
                    <Button type="primary" disabled={true}>
                      Connected
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => this.connectWallet()}>
                      Connect Wallet
                    </Button>
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
