import { Component } from 'react';
import { ContractState, PageState } from './interface';
import { isObservable, Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type StateName<S> = keyof S & string;
type PendingName<S> = `${keyof S & string}Pending` & keyof S;

export class BaseStateComponent<P, S> extends Component<P, S> {
  protected subs: Subscription[] = [];

  public registerState<N extends keyof S, T extends Pick<S, N>>(
    name: N,
    state: ContractState<S[N]> | PageState<S[N]> | Observable<ContractState<S[N]> | PageState<S[N]>>,
    callback?: () => void
  ): void {
    const stateObs = isObservable(state) ? state : of(state);
    const sub: Subscription = stateObs.pipe(switchMap(state => state.watch())).subscribe((s: S[N]) => {
      const newState = { [name]: s } as T;
      this.setState(newState, () => {
        if (callback) {
          callback();
        }
      });
    });

    this.subs.push(sub);
  }

  public registerStatePending<P extends StateName<S>, N extends PendingName<S>, T extends { [k in N]: any }>(
    name: N,
    state: ContractState<S[P]> | Observable<ContractState<S[P]>>
  ): void {
    const stateObs = isObservable(state) ? state : of(state);
    const sub: Subscription = stateObs.pipe(switchMap(state => state.pending())).subscribe((pending: boolean) => {
      const newState = { [name]: pending } as T;
      this.setState(newState);
    });

    this.subs.push(sub);
  }

  public watch<N extends keyof S, T extends Pick<S, N>>(name: N, observable: Observable<S[N]>): void {
    const sub = observable.subscribe((s: S[N]) => {
      this.setState({ [name]: s } as T);
    });

    this.subs.push(sub);
  }

  public tickState(...states: ContractState<any>[]) {
    states.forEach(one => one.tick());
  }

  public destroyState() {
    if (this.subs) {
      this.subs.forEach(one => one.unsubscribe());
      this.subs = [];
    }
  }
}
