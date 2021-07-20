import { AsyncSubject, Observable, of } from 'rxjs';
import { Wallet } from '../../constant';
import { walletManager } from '../../wallet/wallet-manager';
import { filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../../wallet/wallet-interface';
import { EthNetwork } from '../../constant/network';
import MetaMaskOnboarding from '@metamask/onboarding';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

export class WalletState {
  public readonly USER_ADDR: Observable<string>;
  public readonly IS_CONNECTED: Observable<boolean>;
  public readonly NETWORK: Observable<EthNetwork>;

  constructor() {
    this.USER_ADDR = this.watchUserAccount();
    this.IS_CONNECTED = this.watchIsConnected();
    this.NETWORK = this.watchNetwork();
  }

  // the current connected wallet type
  watchWalletType(): Observable<Wallet> {
    return walletManager.watchWalletType().pipe(
      filter((type: Wallet | null) => type !== null),
      map(type => type as Wallet)
    );
  }

  // the wallet returned must be connected
  watchWalletInstance(): Observable<WalletInterface> {
    return walletManager.watchWalletInstance().pipe(
      filter(wallet => wallet !== null),
      map(wallet => wallet as WalletInterface)
    );
  }

  // user connected address
  watchUserAccount(): Observable<string> {
    return this.watchWalletInstance().pipe(
      switchMap((wallet: WalletInterface) => {
        return wallet.watchAccount();
      })
    );
  }

  // user current selected network
  watchNetwork(): Observable<EthNetwork> {
    return this.watchWalletInstance().pipe(
      switchMap((wallet: WalletInterface) => {
        return wallet.watchNetwork();
      })
    );
  }

  // check if the specified type of wallet installed
  isWalletInstalled(wallet: Wallet): boolean {
    switch (wallet) {
      case Wallet.Metamask: {
        return isMetaMaskInstalled();
      }
      case Wallet.WalletConnect: {
        return false;
      }
      default: {
        return false;
      }
    }
  }

  // install the specified type of wallet
  installWallet(wallet: Wallet): void {
    switch (wallet) {
      case Wallet.Metamask: {
        window.location.href = 'https://metamask.io/';
        break;
      }
      case Wallet.WalletConnect: {
        break;
      }
      default: {
      }
    }
  }

  // watch is now has connected to any wallet
  watchIsConnected(): Observable<boolean> {
    const instance: WalletInterface | null = walletManager.getCurWalletInstance();
    return this.watchWalletInstance().pipe(
      startWith(instance),
      switchMap((wallet: WalletInterface | null) => {
        if (wallet) {
          return wallet.wasConnected();
        } else {
          return of(false);
        }
      })
    );
  }

  // do connecting the specified wallet.
  connectToWallet(wallet: Wallet): void {
    walletManager.doSelectWallet(wallet);
  }

  // switch to target network
  switchNetwork(network: EthNetwork.bsc | EthNetwork.bianTest): Observable<boolean> {
    const res = new AsyncSubject<boolean>();
    this.watchWalletInstance()
      .pipe(
        take(1),
        switchMap((wallet: WalletInterface) => {
          return wallet.switchNetwork(network);
        })
      )
      .subscribe(res);

    return res;
  }
}

export const walletState = new WalletState();
