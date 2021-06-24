import { Component } from 'react';
import { Button, Col, Row, Select } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import ModalRender from '../modal-render/index';
import commonStyles from '../funding-balance/modals/style.module.less';
import { from, of, Subscription } from 'rxjs';
import { SupportedWallets, Wallet } from '../../constant/index';
import { walletManager } from '../../wallet/wallet-manager';
// import { delay, filter, map, switchMap } from 'rxjs/operators';
// import { WalletInterface } from '../../wallet/wallet-interface';
import MetaMaskOnboarding from '@metamask/onboarding';
// import { contractAccessor } from '../../wallet/chain-access';
// import { CoinBalance } from '../../wallet/contract-interface';
// import { toEthers } from '../../util/ethers';
import { userAccountInfo, initTryConnect } from '../../services/account';

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

  async componentWillUnmount() {
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
    console.log('do show modal');
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
    if (this.context.address) {
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

    from(userAccountInfo()).subscribe((account: IAccount | null) => {
      this.closeDepositModal();
      this.context.updateAccount(account);
    });
  }

  render() {
    const { visible } = this.state;
    const { children } = this.props;

    return (
      <SiteContext.Consumer>
        {({ connected, address }) => {
          const shouldShow: boolean = (connected === false && (!hasMetaMaskEnv || !address)) || visible;
          return (
            <div className={styles.root}>
              <span onClick={this.showModal}>{children}</span>
              <ModalRender
                visible={shouldShow}
                title="Connect Wallet"
                className={commonStyles.commonModal}
                onCancel={this.closeDepositModal}
                height={300}
                width={500}
                closable={!!address}
                maskClosable={address}
                footer={null}
              >
                <Row gutter={[16, 24]} type="flex" className={styles.coinList}>
                  <Col span={24} className={styles.active}>
                    {hasMetaMaskEnv ? (
                      <Button onClick={() => this.switchWallet(Wallet.Metamask)}>
                        MetaMask
                        {address ? <span>&nbsp;&nbsp;(Connected)</span> : null}
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
                  {address ? (
                    <Col span={24}>
                      <Select defaultValue={address} value={address} style={{ width: '100%', height: 50 }}>
                        <Option value={address}>{address}</Option>
                      </Select>
                    </Col>
                  ) : null}
                  {hasMetaMaskEnv && !address ? (
                    <Col span={24}>
                      <Button type="primary" onClick={() => this.connectWallet()}>
                        Connect Wallet
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </ModalRender>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
