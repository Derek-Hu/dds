import { Component } from 'react';
import { Button, Col, Row, Select } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import { of, Subscription } from 'rxjs';
import { SupportedWallets, Wallet } from '../../constant/index';
import { walletManager } from '../../wallet/wallet-manager';
import { filter, switchMap } from 'rxjs/operators';
import { WalletInterface } from '../../wallet/wallet-interface';

const { Option } = Select;

export default class ConnectWallet extends Component<any, any> {
  state = {
    visible: false,
    isConnected: false,
    walletType: Wallet.Metamask,
    account: undefined,
  };

  private accSub: Subscription | null = null;

  componentDidMount = () => {
    this.watchWalletAccount();
  };

  componentWillUnmount() {
    this.unWatchWalletAccount();
  }

  switchWallet = (walletType: Wallet) => {
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

    walletManager.doSelectWallet(this.state.walletType);
  };

  unWatchWalletAccount() {
    if (this.accSub) {
      this.accSub.unsubscribe();
    }
  }

  watchWalletAccount() {
    this.unWatchWalletAccount();

    this.accSub = walletManager
      .watchWalletInstance()
      .pipe(
        switchMap((walletIns: WalletInterface | null) => {
          if (walletIns) {
            return walletIns?.watchAccount();
          } else {
            return of(null);
          }
        })
      )
      .subscribe((account: string | null) => {
        this.setState({
          isConnected: account !== null,
          account,
        });
      });
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
                {SupportedWallets.map((name) => (
                  <Col key={name} span={24} className={walletType === name ? styles.active : ''}>
                    <Button onClick={() => this.switchWallet(name)}>{name}</Button>
                  </Col>
                ))}
                {isConnected ? (
                  <Col span={24}>
                    <Select
                      defaultValue={this.state.account}
                      value={this.state.account}
                      style={{ width: '100%', height: 50 }}
                    >
                      <Option value={this.state.account}>{this.state.account}</Option>
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
