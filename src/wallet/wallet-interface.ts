import { Observable } from 'rxjs';
import { Wallet } from '../constant';
import { EthNetwork } from '../constant/address';

/**
 * 一个钱包实例要实现的接口
 */
export interface WalletInterface {
  walletType: Wallet;

  doConnect(): void;

  wasConnected(): Observable<boolean>;

  watchAccount(): Observable<string>;

  getAccount(): string | null;

  getNetwork(): EthNetwork | null;

  watchNetwork(): Observable<EthNetwork>;

  tryInitConnect(): Observable<boolean>;

  switchNetwork(id: EthNetwork): Observable<boolean>;
}
