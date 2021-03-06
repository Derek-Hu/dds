import { Wallet } from '../constant';
import { BehaviorSubject, Observable } from 'rxjs';

export class ChainDataState {
  private curWallet: BehaviorSubject<Wallet | null> = new BehaviorSubject<Wallet | null>(null);

  getCurWallet(): Wallet | null {
    return this.curWallet.getValue();
  }

  // 必须是连接成功后才进行设置
  setCurWallet(wallet: Wallet) {
    if (this.curWallet.getValue() === wallet) {
      return;
    }
    this.curWallet.next(wallet);
  }

  watchWallet(): Observable<Wallet | null> {
    return this.curWallet;
  }
}

export const chainDataState = new ChainDataState();
