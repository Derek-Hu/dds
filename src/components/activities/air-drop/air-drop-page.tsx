import { Component } from 'react';
import styles from './air-drop-page.module.less';
import { Col, Row } from 'antd';
import { format } from '../../../util/math';
import NormalButton from '../../common/buttons/normal-btn';
import { walletState } from '../../../state-manager/wallet/wallet-state';
import { MyTokenSymbol, Wallet } from '../../../constant';
import { AsyncSubject, combineLatest, merge, Observable, Subscription } from 'rxjs';
import { EthNetwork } from '../../../constant/network';
import ModalRender from '../../modal-render/index';
import { contractAccessor } from '../../../wallet/chain-access';
import { finalize, map, switchMap, take } from 'rxjs/operators';
import { BigNumber } from 'ethers';
import { toEthers } from '../../../util/ethers';
import { shortAddress } from '../../../util';
import Mask from '../../mask';
import Placeholder from '../../placeholder/index';

type IProps = {};
type IState = {
  isInstalledMetamask: boolean;
  isWalletConnected: boolean;
  isWalletConnectedInit: boolean;
  curNetwork: EthNetwork | null;
  networkReady: boolean;
  needSwitchNetwork: boolean;
  claimAmount: number;
  claimAmountStr: string;
  claimAmountFont: string;
  showConfirm: boolean;
  hasClaimed: boolean;
  claimUserAddress: string;
  isInitPageState: boolean;
};

enum Action {
  Claim,
  Install,
  Connect,
  Claimed,
  None,
}

export default class AirDropPage extends Component<IProps, IState> {
  private readonly TargetNetwork = EthNetwork.bianTest;

  state: IState = {
    isInstalledMetamask: true,
    isWalletConnected: false,
    isWalletConnectedInit: false,
    curNetwork: EthNetwork.bianTest,
    networkReady: false,
    needSwitchNetwork: false,
    claimAmount: -1,
    claimAmountStr: '0',
    claimAmountFont: '11vw',
    showConfirm: false,
    hasClaimed: false,
    claimUserAddress: '',
    isInitPageState: false,
  };
  private subs: Subscription[] = [];

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.subs.forEach(one => one.unsubscribe());
    this.subs = [];
  }

  loadClaimAmount(): Observable<any> {
    const rs = new AsyncSubject();
    walletState
      .watchUserAccount()
      .pipe(
        take(1),
        switchMap((account: string) => {
          return contractAccessor.airDropWhiteList(account);
        }),
        map((amount: BigNumber) => {
          return Number(toEthers(amount, 1, MyTokenSymbol));
        })
      )
      .subscribe((amount: number) => {
        const text: string = format(amount, false);
        const fonts = [9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 8, 7.4, 6.5, 5.8];
        const font: number =
          amount >= 0 && this.state.isWalletConnected ? fonts[text.length > 10 ? 10 : text.length] : 11;

        this.setState(
          {
            claimAmount: amount,
            claimAmountStr: text,
            claimAmountFont: font.toString() + 'vw',
          },
          () => {
            rs.next(true);
            rs.complete();
          }
        );
      });
    return rs;
  }

  loadHasClaimed(): Observable<any> {
    const rs = new AsyncSubject();
    walletState
      .watchUserAccount()
      .pipe(
        take(1),
        switchMap(account => {
          return contractAccessor.airDropHasClaimed(account);
        })
      )
      .subscribe((claimed: boolean) => {
        this.setState({ hasClaimed: claimed }, () => {
          rs.next(true);
          rs.complete();
        });
      });
    return rs;
  }

  onClickBtn() {
    const action: Action = this.mainBtnAction();
    switch (action) {
      case Action.Claim: {
        if (!this.state.hasClaimed) {
          this.setState({ showConfirm: true });
        }
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
        // do nothing
      }
    }
  }

  onCancelConfirmClaim() {
    this.setState({ showConfirm: false });
  }

  onConfirmClaim() {
    const title = 'Airdrop';
    Mask.showLoading('Transferring...', title);
    this.setState({ showConfirm: false });
    contractAccessor.airDropClaim().subscribe((done: boolean) => {
      if (done) {
        Mask.showSuccess(title);
      } else {
        Mask.showFail(null, title);
      }
      this.loadHasClaimed();
    });
  }

  switchToTargetNetwork() {
    walletState.switchNetwork(this.TargetNetwork);
  }

  private mainBtnAction(): Action {
    const action: Action = this.state.isInstalledMetamask
      ? this.state.isWalletConnected
        ? this.state.hasClaimed
          ? Action.Claimed
          : this.state.claimAmount > 0
          ? Action.Claim
          : Action.None
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
      case Action.None: {
        return 'No available claim';
      }
      case Action.Claimed: {
        return 'CLAIMED';
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
    const sub1 = walletState.watchIsConnected().subscribe((isConnected: boolean) => {
      this.setState({ isWalletConnectedInit: true });
    });

    const sub = combineLatest([
      walletState.watchIsConnected(),
      walletState.watchNetwork(),
      walletState.watchUserAccount(),
    ]).subscribe(([isConnected, network, account]) => {
      this.setState(
        {
          isWalletConnected: isConnected,
          curNetwork: network,
          networkReady: isConnected && network === this.TargetNetwork,
          needSwitchNetwork: isConnected && network !== this.TargetNetwork,
          claimUserAddress: account,
          showConfirm:
            this.state.showConfirm &&
            isConnected &&
            network === this.TargetNetwork &&
            account === this.state.claimUserAddress,
        },
        () => {
          if (this.state.networkReady) {
            merge(this.loadClaimAmount(), this.loadHasClaimed())
              .pipe(
                finalize(() => {
                  if (!this.state.isInitPageState) {
                    this.setState({ isInitPageState: true });
                  }
                })
              )
              .subscribe();
          }
        }
      );
    });

    this.subs.push(sub1, sub);
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
              <div className={[styles.amountTitle, styles.amountTitleFont].join(' ')}>
                <span>Amount</span>
                <span className={styles.sld}>SLD</span>
              </div>
              <div
                className={
                  !this.state.isWalletConnected
                    ? styles.amountXxx
                    : this.state.hasClaimed
                    ? styles.amountClaimed
                    : styles.amountNum
                }
                style={{ fontSize: this.state.claimAmountFont }}
              >
                {!this.state.isWalletConnected || !this.state.isInitPageState ? '******' : this.state.claimAmountStr}
              </div>

              <div className={styles.claimBtn}>
                <Placeholder
                  loading={
                    (this.state.isInstalledMetamask && !this.state.isWalletConnectedInit) ||
                    (this.state.isWalletConnected && !this.state.isInitPageState)
                  }
                >
                  <NormalButton
                    type={'primary'}
                    marginTop={'5px'}
                    disabled={this.state.isWalletConnected && (this.state.hasClaimed || this.state.claimAmount === 0)}
                    onClick={this.onClickBtn.bind(this)}
                  >
                    <span className={styles.btnFont}>{this.getActionDesc(this.mainBtnAction())}</span>
                  </NormalButton>
                </Placeholder>
              </div>

              <div className={styles.rules}>
                <a>Learn more about airdrop</a>
              </div>
            </div>
          </Col>
          <Col span={13} className={styles.rightBg} />
        </Row>

        {/* Network Modal */}
        <ModalRender visible={this.state.curNetwork !== this.TargetNetwork} footer={null} title={'Switch Network'}>
          <div className={styles.modalDesc}>Switch to BSC network for claiming airdrops.</div>

          <NormalButton type={'primary'} onClick={this.switchToTargetNetwork.bind(this)}>
            Switch To BSC
          </NormalButton>
        </ModalRender>

        {/* Confirm Modal */}
        <ModalRender
          visible={this.state.showConfirm && this.state.networkReady && !this.state.hasClaimed}
          footer={null}
          onCancel={this.onCancelConfirmClaim.bind(this)}
          title={'Claim Airdrop'}
        >
          <Row gutter={[16, 16]}>
            <Col span={4} className={styles.confirmTitle}>
              Amount:
            </Col>
            <Col span={20} className={styles.confirmText}>
              {this.state.claimAmountStr} <span className={styles.confirmSld}>SLD</span>
            </Col>
            <Col span={4} className={styles.confirmTitle}>
              Address:
            </Col>
            <Col span={20} className={styles.confirmText}>
              {shortAddress(this.state.claimUserAddress, true)}
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <NormalButton type={'default'} onClick={this.onCancelConfirmClaim.bind(this)}>
                CANCEL
              </NormalButton>
            </Col>
            <Col span={12}>
              <NormalButton type={'primary'} onClick={this.onConfirmClaim.bind(this)}>
                CONFIRM
              </NormalButton>
            </Col>
          </Row>
        </ModalRender>
      </div>
    );
  }
}
