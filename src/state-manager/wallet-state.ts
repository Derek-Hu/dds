import { AsyncSubject, Observable } from 'rxjs';
import { Wallet } from '../constant';
import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { EthNetwork } from '../constant/network';
import MetaMaskOnboarding from '@metamask/onboarding';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

export class WalletState {
  constructor() {}

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
  installWallet(wallet: Wallet) {
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
    return this.watchWalletInstance().pipe(
      switchMap((wallet: WalletInterface) => {
        return wallet.wasConnected();
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
