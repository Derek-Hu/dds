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
    walletType: Wallet.Metamask,
    account: null,
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
        account: null,
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

  disconnectWallet = () => {
    this.context.updateAccount(null);
  }
  connectWallet = () => {
    if (this.context.account) {
      return;
    }

    walletManager.doSelectWallet(this.state.walletType);
  };

  unWatchWalletAccount() {
    if (this.accSub) {
      this.accSub.unsubscribe();
    }
  }

  static contextType = SiteContext;

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
        this.context.updateAccount(account);
        // this.setState({
        //   isConnected: account !== null,
        //   account,
        // });
      });
  }

  render() {
    const { visible, walletType } = this.state;
    const { children } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => (
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
                {account ? (
                  <Col span={24}>
                    <Select
                      defaultValue={account}
                      value={account}
                      style={{ width: '100%', height: 50 }}
                    >
                      <Option value={account}>{account}</Option>
                    </Select>
                  </Col>
                ) : null}
                <Col span={24}>
                  {account ? (
                    <Button type="primary" onClick={() => this.disconnectWallet()}>
                      Disconnected Wallet
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
