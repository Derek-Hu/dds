import { Component } from 'react';
import { CacheState, ContractState, DatabaseState, PageState } from './interface';
import { interval, isObservable, Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type StateName<S> = keyof S & string;
type PendingName<S> = `${keyof S & string}Pending` & keyof S;

export class BaseStateComponent<P, S> extends Component<P, S> {
  protected subs: Subscription[] = [];

  public registerState<N extends keyof S, T extends Pick<S, N>>(
    name: N,
    state:
      | ContractState<S[N]>
      | PageState<S[N]>
      | DatabaseState<S[N]>
      | CacheState<S[N] | null>
      | Observable<ContractState<S[N]> | PageState<S[N]> | DatabaseState<S[N]> | CacheState<S[N] | null>>,
    callback?: () => void
  ): void {
    const stateObs = isObservable(state) ? state : of(state);
    const sub: Subscription = stateObs.pipe(switchMap(state => state.watch())).subscribe((s: S[N] | null) => {
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

  public tickState(...states: (ContractState<any> | DatabaseState<any>)[]) {
    states.forEach(one => one.tick());
  }

  public tickInterval(time: number, ...states: (ContractState<any> | DatabaseState<any>)[]): void {
    const sub = interval(time).subscribe(() => {
      this.tickState(...states);
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
