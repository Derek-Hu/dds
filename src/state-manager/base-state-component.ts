import { Component } from 'react';
import { ContractState, PageState } from './interface';
import { isObservable, NEVER, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class BaseStateComponent<P, S> extends Component<P, S> {
  protected subs: Subscription[] = [];

  public registerState<N extends keyof S, T extends Pick<S, N>>(
    name: N,
    state: ContractState<S[N]> | PageState<S[N]>
  ): void {
    const sub: Subscription = state.watch().subscribe((s: S[N]) => {
      const newState = { [name]: s } as T;
      this.setState(newState);
    });

    this.subs.push(sub);
  }

  public registerSwitchState<N extends keyof S, T extends Pick<S, N>, K>(
    name: N,
    switchKey: Observable<K> | { watch: () => Observable<K> },
    switchState: Map<K, ContractState<S[N]> | PageState<S[N]>>
  ) {
    if (!isObservable(switchKey)) {
      switchKey = switchKey.watch();
    }

    const sub = switchKey
      .pipe(
        switchMap((key: K) => {
          const state: ContractState<S[N]> | PageState<S[N]> | undefined = switchState.get(key);
          if (state) {
            return state.watch();
          } else {
            return NEVER;
          }
        })
      )
      .subscribe((s: S[N]) => {
        this.setState({ [name]: s } as T);
      });

    this.subs.push(sub);
  }

  public watch<N extends keyof S, T extends Pick<S, N>>(name: N, observable: Observable<S[N]>): void {
    const sub = observable.subscribe((s: S[N]) => {
      this.setState({ [name]: s } as T);
    });

    this.subs.push(sub);
  }

  public destroyState() {
    if (this.subs) {
      this.subs.forEach(one => one.unsubscribe());
      this.subs = [];
    }
  }
}
