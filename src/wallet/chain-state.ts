import { Wallet } from '~/constant';
import { BehaviorSubject, Observable } from 'rxjs';

export class ChainDataState {
  private curWallet: BehaviorSubject<Wallet | null> = new BehaviorSubject<Wallet | null>(
    null
  );

  getCurWallet(): Wallet | null {
    return this.curWallet.getValue();
  }

  setCurWallet(wallet: Wallet) {
    this.curWallet.next(wallet);
  }

  watchWallet(): Observable<Wallet | null> {
    return this.curWallet;
  }
}

export const chainDataState = new ChainDataState();
