import MetaMaskOnboarding from '@metamask/onboarding';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Wallet } from '../constant';
import { WalletInterface } from '../wallet/wallet-interface';
import { filter, map, take } from 'rxjs/operators';
import { EthNetwork } from '../constant/address';

declare const window: Window & { ethereum: any };

export const { isMetaMaskInstalled } = MetaMaskOnboarding;

/**
 * Metamask钱包实例
 */
export class MetamaskWallet implements WalletInterface {
  public readonly walletType: Wallet = Wallet.Metamask;
  private curSelectedAccount: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private curNetwork: BehaviorSubject<EthNetwork | undefined> = new BehaviorSubject<EthNetwork | undefined>(undefined);

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
    return this.curSelectedAccount.pipe(map(account => account !== null));
  }

  public getAccount(): string | null {
    return this.curSelectedAccount.getValue();
  }

  public watchNetwork(): Observable<EthNetwork> {
    return this.curNetwork.pipe(
      filter(net => net !== undefined),
      map(net => net as EthNetwork)
    );
  }

  public getNetwork(): EthNetwork | undefined {
    return this.curNetwork.getValue();
  }

  public tryInitConnect(): Observable<boolean> {
    if (isMetaMaskInstalled()) {
      return this.doRequest(false).pipe(
        map((rs: string[]) => {
          if (rs.length > 0) {
            this.updateAccount(rs);
            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return of(false);
    }
  }

  public watchAccount(): Observable<string> {
    return this.curSelectedAccount.pipe(
      filter(account => account !== null),
      map(acc => acc as string)
    );
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

  private updateNetwork(network: EthNetwork) {
    console.log('update network', network);
    this.curNetwork.next(network);
  }

  private syncAccount(init = false): void {
    if (isMetaMaskInstalled()) {
      this.doRequest(init).subscribe((rsAccounts: string[]) => {
        this.updateAccount(rsAccounts);
        if (rsAccounts && rsAccounts.length > 0) {
          this.watchAccountChange();
        }
      });

      this.doRequestNetwork().subscribe(network => {
        this.updateNetwork(network as EthNetwork);
        this.watchNetworkChange();
      });
    }
  }

  private doRequest(init: boolean): Observable<string[]> {
    const method = init ? 'eth_requestAccounts' : 'eth_accounts';
    const reqAccounts: Promise<string[]> = window.ethereum.request({
      method,
    });
    return from(reqAccounts).pipe(take(1));
  }

  private doRequestNetwork(): Observable<string> {
    const req: Promise<string> = window.ethereum.request({ method: 'net_version' });
    return from(req).pipe(take(1));
  }

  private accountChangeCallback = (accounts: string[]) => {
    this.updateAccount(accounts);
  };

  private networkChangeCallback = (network: EthNetwork) => {
    this.updateNetwork(network);
  };

  private chainChangeCallback = (chainId: string) => {
    console.log('chain id', chainId);
  };

  private watchAccountChange() {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', this.accountChangeCallback);
    }
  }

  private watchChainChange() {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', this.chainChangeCallback);
    }
  }

  private watchNetworkChange() {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('networkChanged', this.networkChangeCallback);
    }
  }
}
