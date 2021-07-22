import { CacheParser, CachePatcher, CacheSerializer, CacheState } from '../interface';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { walletState } from '../wallet/wallet-state';
import { finalize, map, switchMap, take } from 'rxjs/operators';
import { EthNetwork } from '../../constant/network';

export class CacheStateImp<T> implements CacheState<T> {
  private state: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  private sub: Subscription | null = null;
  constructor(
    private key: string,
    private serializer: CacheSerializer<T>,
    private parser: CacheParser<T>,
    private patcher?: CachePatcher<T>
  ) {}

  getKey(): string {
    return this.key;
  }

  get(): Observable<T | null> {
    return this.watchNetworkAndAccount().pipe(
      take(1),
      map(({ network, address }) => {
        return this.doGet(network, address);
      })
    );
  }

  set(state: T | null): void {
    this.getCurKey().subscribe((key: string) => {
      if (state === null) {
        localStorage.removeItem(key);
      } else {
        const lastStr: string | null = this.serializer(state);
        if (lastStr === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, lastStr);
        }
      }

      this.state.next(state);
    });
  }

  patch(state: T | null) {
    if (this.patcher) {
      this.get().subscribe((old: T | null) => {
        const newState: T | null = (this.patcher as CachePatcher<T>)(old, state);
        this.set(newState);
      });
    } else {
      this.set(state);
    }
  }

  watch(): Observable<T | null> {
    return of(true).pipe(
      switchMap(() => {
        if (!this.isWatching()) {
          this.doWatch();
        }

        return this.state;
      }),
      finalize(() => {
        if (!this.state.observed) {
          this.unwatch();
        }
      })
    );
  }

  private isWatching(): boolean {
    return this.sub !== null;
  }

  private doWatch() {
    this.sub = this.watchNetworkAndAccount()
      .pipe(
        map(({ network, address }) => {
          return this.doGet(network, address);
        })
      )
      .subscribe((state: T | null) => {
        this.state.next(state);
      });
  }

  private unwatch() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }

  private getCurKey(): Observable<string> {
    return this.watchNetworkAndAccount().pipe(
      take(1),
      map(({ network, address }) => {
        return this.computeRealKey(network, address);
      })
    );
  }

  private computeRealKey(network: EthNetwork, address: string) {
    return this.key + '-' + network.toString() + '-' + address;
  }

  private watchNetworkAndAccount(): Observable<{ network: EthNetwork; address: string }> {
    return combineLatest([walletState.NETWORK, walletState.USER_ADDR]).pipe(
      map(([network, address]) => {
        return { network, address };
      })
    );
  }

  private doGet(network: EthNetwork, address: string): T | null {
    const key = this.computeRealKey(network, address);
    const cacheStr: string | null = localStorage.getItem(key);
    if (cacheStr !== null) {
      return this.parser(cacheStr);
    }

    return null;
  }
}
