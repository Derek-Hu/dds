import { Row, Col, Radio, Input, Tag, Button } from 'antd';
import styles from './style.module.less';
import DespositModal from './modals/deposit';
import WithdrawModal from './modals/withdraw';
import OrderConfirm from './modals/order-confirm';
import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';
import { contractAccessor } from '../../wallet/chain-access';
import { NEVER, Subscription } from 'rxjs';
import { BigNumber } from 'ethers';
import { ETH_WEIGHT } from '~/constant';
import { walletManager } from '~/wallet/wallet-manager';
import { WalletInterface } from '~/wallet/wallet-interface';
import { filter, map, switchMap } from 'rxjs/operators';
import { toEthers } from '~/util/ethers';

export default class Balance extends Component {
  state = {
    depositVisible: false,
    withdrawVisible: false,
    orderConfirmVisible: false,
    tradeType: 'Long',
    curPrice: '--',
    balance: '--',
    locked: '--',
    available: '--',
    depositAmount: 0,
    withdrawAmount: 0,
  };

  private subs: Subscription[] = [];

  componentDidMount = () => {
    const sub = contractAccessor.watchPriceByETHDAI().subscribe((price: string) => {
      this.setState({ curPrice: price });
    });

    const sub2 = walletManager
      .watchWalletInstance()
      .pipe(
        filter((wallet: WalletInterface | null) => {
          return wallet !== null;
        }),
        map((wallet: WalletInterface | null) => {
          return wallet as WalletInterface;
        }),
        switchMap((wallet: WalletInterface) => {
          return wallet.watchAccount();
        }),
        switchMap((userAccount: string | null) => {
          if (userAccount === null) {
            return NEVER;
          }
          return contractAccessor.watchUserAccount(userAccount);
        })
      )
      .subscribe(({ deposit, available }) => {
        const locked: BigNumber = BigNumber.from(deposit).sub(BigNumber.from(available));
        this.setState({
          balance: toEthers(deposit, 4),
          locked: toEthers(locked, 4),
          available: toEthers(available, 4),
        });
      });

    this.subs.push(sub, sub2);
  };

  componentWillUnmount = () => {
    this.subs.forEach((one) => one.unsubscribe());
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

  changeDepositAmount = (amount: any) => {
    const value: number = Number(amount.target.value);
    this.state.depositAmount = isNaN(value) ? 0 : value;
  };

  changeWithdrawAmount = (amount: any) => {
    const value: number = Number(amount.target.value);
    this.state.withdrawAmount = isNaN(value) ? 0 : value;
  };

  deposit = () => {
    if (this.state.depositAmount <= 0) {
      return;
    }

    const amount: BigNumber = BigNumber.from(this.state.depositAmount).mul(BigNumber.from(ETH_WEIGHT));
    contractAccessor.depositToken(amount.toString()).subscribe(() => {
      this.closeDepositModal();
    });
  };

  withdraw = () => {
    if (this.state.withdrawAmount <= 0) {
      return;
    }

    const amount: BigNumber = BigNumber.from(this.state.withdrawAmount).mul(BigNumber.from(ETH_WEIGHT));
    contractAccessor.withdrawToken(amount.toString()).subscribe(() => {
      this.closeWithdrawModal();
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
          <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
            <h2>
              Funding Balance<span>(DAI)</span>
            </h2>
            <p className={styles.balanceVal}>{this.state.balance}</p>
            <div className={styles.dayChange}>
              {this.state.locked} &nbsp;<span>Locked</span>
            </div>
            <Row className={styles.actionLink} type="flex" justify="space-between">
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
            <p className={styles.price}>Current Price: {this.state.curPrice} DAI</p>
            <p className={styles.amountTip}>Amount</p>
            <Input placeholder="0.00" suffix={'ETH'} />

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
              onDeposit={this.deposit}
              onCancel={this.closeDepositModal}
              onAmountChange={this.changeDepositAmount}
              visible={depositVisible}
            />
            <WithdrawModal
              onCancel={this.closeWithdrawModal}
              onAmountChange={this.changeWithdrawAmount}
              onWithdraw={this.withdraw}
              maxWithdraw={this.state.available}
              visible={withdrawVisible}
            />
            <OrderConfirm onCancel={this.closeOrderConfirmModal} visible={orderConfirmVisible} />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
