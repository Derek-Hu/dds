import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { WalletInterface } from './wallet-interface';
import { map, tap } from 'rxjs/operators';
import { Wallet } from '../constant';
import { MetamaskWallet } from './metamask';

/**
 * 获取钱包实例
 */
export class WalletManager {
  // metamask 钱包实例
  private readonly metamask: WalletInterface;

  private curWallet: BehaviorSubject<Wallet | null> = new BehaviorSubject<Wallet | null>(null);

  constructor() {
    this.metamask = new MetamaskWallet();

    //
    this.selectConnectedWallet();
  }

  public watchWalletType(): Observable<Wallet | null> {
    return this.curWallet;
  }

  public watchWalletInstance(): Observable<WalletInterface | null> {
    return this.curWallet.pipe(
      map((wallet: Wallet | null) => {
        if (wallet === Wallet.Metamask) {
          return this.metamask as WalletInterface;
        } else {
          return null;
        }
      })
    );
  }

  public doSelectWallet(wallet: Wallet) {
    if (wallet === Wallet.Metamask) {
      this.metamask.doConnect();
    }
  }

  // -------------------------------------------------------------------

  // 监听钱包状态，设置当前使用的钱包
  private selectConnectedWallet() {
    combineLatest([this.metamask.wasConnected()])
      .pipe(
        tap(([metamask]: [boolean]) => {
          // 当之后有多个钱包时，根据某种规则选择一个，当前只有metamask
          if (metamask && this.curWallet.getValue() !== Wallet.Metamask) {
            this.curWallet.next(Wallet.Metamask);
          }
        })
      )
      .subscribe();
  }
}

export const walletManager = new WalletManager();
