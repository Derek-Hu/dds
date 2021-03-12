import { Observable } from 'rxjs';
import { Wallet } from '../constant';

/**
 * 一个钱包实例要实现的接口
 */
export interface WalletInterface {
  walletType: Wallet;

  doConnect(): void;

  watchAccount(): Observable<string | null>;
}
