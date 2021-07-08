import { Component } from 'react';
import styles from './air-drop-page.module.less';
import { Col, Row } from 'antd';
import { format } from '../../../util/math';
import NormalButton from '../../common/buttons/normal-btn';
import { walletState } from '../../../state-manager/wallet-state';
import { Wallet } from '../../../constant';
import { combineLatest, Subscription } from 'rxjs';
import { EthNetwork } from '../../../constant/network';

type IProps = {};
type IState = {
  isInstalledMetamask: boolean;
  isWalletConnected: boolean;
  curNetwork: EthNetwork | null;
  networkReady: boolean;
  claimAmount: number;
};

enum Action {
  Claim,
  Install,
  Connect,
}

export default class AirDropPage extends Component<IProps, IState> {
  private static TargetNetwork = EthNetwork.bianTest;
  state: IState = {
    isInstalledMetamask: true,
    isWalletConnected: false,
    curNetwork: null,
    networkReady: false,
    claimAmount: 0,
  };
  private subs: Subscription[] = [];

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.subs.forEach(one => one.unsubscribe());
    this.subs = [];
  }

  loadClaimAmount() {}

  onClickBtn() {
    const action: Action = this.confirmBtnAction();
    switch (action) {
      case Action.Claim: {
        break;
      }
      case Action.Connect: {
        // connect metamask
        walletState.connectToWallet(Wallet.Metamask);
        break;
      }
      case Action.Install: {
        // install metamask
        walletState.installWallet(Wallet.Metamask);
        break;
      }
      default: {
      }
    }
  }

  private confirmBtnAction(): Action {
    const action: Action = this.state.isInstalledMetamask
      ? this.state.isWalletConnected
        ? Action.Claim
        : Action.Connect
      : Action.Install;
    return action;
  }

  private getActionDesc(action: Action): string {
    switch (action) {
      case Action.Claim: {
        return 'CLAIM';
      }
      case Action.Install: {
        return 'Install Metamask';
      }
      case Action.Connect: {
        return 'Connect wallet to see your amount';
      }
      default: {
        return 'Connect wallet to see your amount';
      }
    }
  }

  private init() {
    const newState = {
      isInstalledMetamask: walletState.isWalletInstalled(Wallet.Metamask),
    };

    this.setState(newState, () => {
      if (this.state.isInstalledMetamask) {
        this.watchWallet();
      }
    });
  }

  private watchWallet() {
    const sub = combineLatest([walletState.watchIsConnected(), walletState.watchNetwork()]).subscribe(
      ([isConnected, network]) => {
        this.setState(
          {
            isWalletConnected: isConnected,
            curNetwork: network,
            networkReady: isConnected && network === AirDropPage.TargetNetwork,
          },
          () => {
            if (this.state.networkReady) {
              this.loadClaimAmount();
            }
          }
        );
      }
    );

    this.subs.push(sub);
  }

  render() {
    return (
      <div className={styles.bodyWrapper}>
        <Row gutter={[0, 0]}>
          <Col span={11} className={styles.leftContent}>
            <div className={styles.logo}>
              <div className={styles.logoWrapper} />
              <div className={styles.airdropName}>Airdrop</div>
            </div>

            <div className={styles.amount}>
              <div className={[styles.amountTitle, styles.amountTitleFont].join(' ')}>Amount</div>
              <div className={this.state.claimAmount === 0 ? styles.amountXxx : styles.amountNum}>
                {this.state.claimAmount === 0 ? '******' : format(89000)}
              </div>
              <div className={styles.claimBtn}>
                <NormalButton type={'primary'} marginTop={'5px'} onClick={this.onClickBtn.bind(this)}>
                  <span className={styles.btnFont}>{this.getActionDesc(this.confirmBtnAction())}</span>
                </NormalButton>
              </div>

              <div className={styles.rules}>
                <a>See Airdrop Rules</a>
              </div>
            </div>
          </Col>
          <Col span={13} className={styles.rightBg} />
        </Row>
      </div>
    );
  }
}
