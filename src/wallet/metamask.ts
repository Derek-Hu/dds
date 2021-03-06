import MetaMaskOnboarding from '@metamask/onboarding';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { chainDataState } from './chain-connect-state';
import { Wallet } from '~/constant';
import { WalletInterface } from '~/wallet/wallet-interface';

declare const window: Window & { ethereum: any };

export const { isMetaMaskInstalled } = MetaMaskOnboarding;

export class MetamaskWallet implements WalletInterface {
  public readonly walletType: Wallet = Wallet.Metamask;
  private accounts: string[] = [];
  private curSelectedAccount: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() {
    this.syncAccount();
  }

  public isChainConnected(): boolean {
    if (isMetaMaskInstalled()) {
      return window.ethereum.isConnected();
    }
    return false;
  }

  /**
   * user click connect button.
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

  public getAccounts(): string[] {
    return this.accounts || [];
  }

  public getCurSelectedAccount(): string | null {
    return this.curSelectedAccount.getValue();
  }

  public watchAccount(): Observable<string | null> {
    return this.curSelectedAccount;
  }

  // --------------------------------------------------------------------------

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
      // 当前只有metamask钱包，当获取到账号时，直接更新全局状态
      chainDataState.setCurWallet(Wallet.Metamask);

      this.accounts = accounts;
      this.curSelectedAccount.next(accounts[0]);
    } else {
      this.accounts = [];
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

export const metamaskWallet = new MetamaskWallet();
