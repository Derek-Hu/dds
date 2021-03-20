import MetaMaskOnboarding from '@metamask/onboarding';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Wallet } from '../constant';
import { WalletInterface } from '../wallet/wallet-interface';
import { filter, map } from 'rxjs/operators';
import { CoinBalance } from './contract-interface';

declare const window: Window & { ethereum: any };

export const { isMetaMaskInstalled } = MetaMaskOnboarding;

/**
 * Metamask钱包实例
 */
export class MetamaskWallet implements WalletInterface {
  public readonly walletType: Wallet = Wallet.Metamask;
  private curSelectedAccount: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() {
    // 初始化时自动尝试连接
    this.syncAccount();
  }

  /**
   * user click connect button.
   * 用户手动连接
   */
  public doConnect() {
    if (isMetaMaskInstalled()) {
      // try to get account from metamask
      this.syncAccount(true);
    } else {
      // to install metamask
      this.boardingMetamask();
    }
  }

  public wasConnected(): Observable<boolean> {
    return this.curSelectedAccount.pipe(map((account) => account !== null));
  }

  public getAccount(): string | null {
    return this.curSelectedAccount.getValue();
  }

  public watchAccount(): Observable<string | null> {
    return this.curSelectedAccount.pipe(filter((account) => account !== null));
  }

  // --------------------------------------------------------------------------

  private isChainConnected(): boolean {
    if (isMetaMaskInstalled()) {
      return window.ethereum.isConnected();
    }
    return false;
  }

  private boardingMetamask() {
    if (isMetaMaskInstalled()) {
      return;
    }
    const onBoarding = new MetaMaskOnboarding({
      forwarderMode: 'INJECT',
    });
    onBoarding.startOnboarding();
  }

  private updateAccount(accounts: string[]) {
    if (accounts && accounts.length > 0) {
      this.curSelectedAccount.next(accounts[0]);
    } else {
      this.curSelectedAccount.next(null);
    }
  }

  private syncAccount(init: boolean = false) {
    if (isMetaMaskInstalled()) {
      const method = init ? 'eth_requestAccounts' : 'eth_accounts';
      const reqAccounts: Promise<string[]> = window.ethereum.request({
        method,
      });

      from(reqAccounts).subscribe(
        (accounts: string[]) => {
          // 如果没有连接，返回空数组
          this.updateAccount(accounts);
          if (accounts && accounts.length > 0) {
            this.watchAccountChange();
          }
        },
        (error) => {}
      );
    }
  }

  private accountChangeCallback = (accounts: string[]) => {
    this.updateAccount(accounts);
  };

  private watchAccountChange() {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', this.accountChangeCallback);
    }
  }
}
