import { Observable } from 'rxjs';
import { Wallet } from '~/constant';

export interface WalletInterface {
  walletType: Wallet;

  doConnect(): void;

  watchAccount(): Observable<string | null>;
}
