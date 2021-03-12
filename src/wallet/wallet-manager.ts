import { chainDataState } from './chain-connect-state';
import { Observable } from 'rxjs';
import { WalletInterface } from './wallet-interface';
import { map } from 'rxjs/operators';
import { Wallet } from '../constant';
import { metamaskWallet } from './metamask';

/**
 * 获取钱包实例
 */
export class WalletManager {
  watchWalletInstance(): Observable<WalletInterface | null> {
    return chainDataState.watchWallet().pipe(
      map((wallet: Wallet | null) => {
        if (wallet === Wallet.Metamask) {
          return metamaskWallet as WalletInterface;
        } else {
          return null;
        }
      })
    );
  }
}

export const walletManager = new WalletManager();
