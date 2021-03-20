import { Component } from 'react';
import { Button, Col, Row, Select } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import { of, Subscription } from 'rxjs';
import { SupportedWallets, Wallet } from '../../constant/index';
import { walletManager } from '../../wallet/wallet-manager';
import { filter, map, switchMap } from 'rxjs/operators';
import { WalletInterface } from '../../wallet/wallet-interface';
import MetaMaskOnboarding from '@metamask/onboarding';
import { contractAccessor } from '../../wallet/chain-access';
import { CoinBalance } from '../../wallet/contract-interface';
import { toEthers } from '../../util/ethers';

const { Option } = Select;
const { isMetaMaskInstalled } = MetaMaskOnboarding;

const hasMetaMaskEnv = process.env.NODE_ENV === 'development' ? true : isMetaMaskInstalled();
export default class ConnectWallet extends Component<any, any> {
  state = {
    visible: false,
    walletType: Wallet.Metamask,
    account: null,
  };

  private accSub: Subscription | null = null;

  componentDidMount = () => {
    if (!hasMetaMaskEnv) {
      return;
    }
    this.watchWalletAccount();
  };

  componentWillUnmount() {
    if (!hasMetaMaskEnv) {
      return;
    }
    this.unWatchWalletAccount();
  }

  switchWallet = (walletType: Wallet) => {
    if (!hasMetaMaskEnv) {
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
        }),
        switchMap((account: string | null) => {
          if (account) {
            return contractAccessor.getUserSelfWalletBalance(account).pipe(
              map((balances: CoinBalance[]) => {
                return {
                  address: account,
                  USDBalance: balances.map(one => ({
                    coin: one.coin,
                    amount: Number(toEthers(one.balance, 4, one.coin)),
                  })),
                } as UserAccountInfo;
              })
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe((account: UserAccountInfo | null) => {
        const tranformed: IAccount = {
          address: account ? account.address : '',
          USDBalance:
            account && account.USDBalance
              ? account.USDBalance.reduce((total, { coin, amount }) => {
                  // @ts-ignore
                  total[coin] = amount;
                  return total;
                }, {})
              : {},
        };
        this.context.updateAccount(tranformed);
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
              visible={!hasMetaMaskEnv || !account || visible}
              title="Connect Wallet"
              className={commonStyles.commonModal}
              onCancel={this.closeDepositModal}
              height={300}
              width={500}
              closable={account}
              maskClosable={account}
              footer={null}
            >
              <Row gutter={[16, 24]} type="flex" className={styles.coinList}>
                <Col span={24} className={styles.active}>
                  {hasMetaMaskEnv ? (
                    <Button onClick={() => this.switchWallet(Wallet.Metamask)}>
                      MetaMask
                      {account ? <span>&nbsp;&nbsp;(Connected)</span> : null}
                    </Button>
                  ) : (
                    <a href={'https://metamask.io/'}>
                      <Button>Install MetaMask</Button>
                    </a>
                  )}
                </Col>
                <Col span={24}>
                  <a href={'https://walletconnect.org/'}>
                    <Button>
                      Wallet Connect
                      <span
                        style={{
                          color: '#d9d9d9',
                        }}
                      >
                        &nbsp;&nbsp;(Coming Soon)
                      </span>
                    </Button>
                  </a>
                </Col>
                {account ? (
                  <Col span={24}>
                    <Select
                      defaultValue={account.address}
                      value={account.address}
                      style={{ width: '100%', height: 50 }}
                    >
                      <Option value={account.address}>{account.address}</Option>
                    </Select>
                  </Col>
                ) : null}
                {hasMetaMaskEnv && !account ? (
                  <Col span={24}>
                    <Button type="primary" onClick={() => this.connectWallet()}>
                      Connect Wallet
                    </Button>
                  </Col>
                ) : null}
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
