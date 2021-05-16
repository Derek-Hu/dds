import { asyncScheduler, merge, Observable, Subject } from 'rxjs';
import { walletManager } from '../wallet/wallet-manager';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';

export class AccountChangeService {
  private events: Subject<any> = new Subject<any>();

  constructor() {
    walletManager
      .watchWalletInstance()
      .pipe(
        filter(wallet => wallet !== null),
        map(wallet => wallet as WalletInterface),
        switchMap((wallet: WalletInterface) => {
          return merge(wallet.watchNetwork(), wallet.watchAccount());
        }),
        debounceTime(300),
        tap(() => {
          this.triggerAccountEvent();
        })
      )
      .subscribe();
  }

  public watchAccountEvent(): Observable<any> {
    return this.events;
  }

  public triggerAccountEvent() {
    asyncScheduler.schedule(() => {
      this.events.next(true);
    });
  }
}

export const accountEvents = new AccountChangeService();
