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

const WalletHome = {
  [Wallet.Metamask]: 'https://metamask.io/',
  [Wallet.WalletConnect]: 'https://walletconnect.org/',
}
export default class ConnectWallet extends Component<{ noEnv?: boolean }, any> {
  state = {
    visible: false,
    walletType: Wallet.Metamask,
    account: null,
  };

  private accSub: Subscription | null = null;

  componentDidMount = () => {
    if (this.props.noEnv) {
      return;
    }
    this.watchWalletAccount();
  };

  componentWillUnmount() {
    if (this.props.noEnv) {
      return;
    }
    this.unWatchWalletAccount();
  }

  switchWallet = (walletType: Wallet) => {
    if (this.props.noEnv) {
      return;
    }

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
  };
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
    const { children, noEnv } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => (
          <div className={styles.root}>
            <span onClick={this.showModal}>{children}</span>
            <ModalRender
              visible={noEnv || visible}
              title="Connect Wallet"
              className={commonStyles.commonModal}
              onCancel={this.closeDepositModal}
              height={300}
              width={500}
              closable={!noEnv}
              maskClosable={!noEnv}
              footer={null}
            >
              <Row gutter={[16, 24]} type="flex" className={styles.coinList}>
                {SupportedWallets.map((name) => (
                  <Col key={name} span={24} className={!noEnv && walletType === name ? styles.active : ''}>
                    <a href={WalletHome[name]}>
                      <Button onClick={() => this.switchWallet(name)}>
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: '1em',
                          }}
                        >
                          {name === Wallet.Metamask ? 'Install' : ''}
                        </span>
                        {name}{' '}
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'red',
                            display: 'inline-block',
                            marginLeft: '15px',
                          }}
                        >
                          {name !== Wallet.Metamask ? 'Coming Soon' : ''}
                        </span>
                      </Button>
                    </a>
                  </Col>
                ))}
                {account ? (
                  <Col span={24}>
                    <Select defaultValue={account} value={account} style={{ width: '100%', height: 50 }}>
                      <Option value={account}>{account}</Option>
                    </Select>
                  </Col>
                ) : null}
                {noEnv ? null : (
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
                )}
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
