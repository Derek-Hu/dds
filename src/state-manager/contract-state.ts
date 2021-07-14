import { ContractState, StateGetter } from './interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, finalize, map, startWith, switchMap, take, tap } from 'rxjs/operators';

export class ContractStateImp<T> implements ContractState<T> {
  private state: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  private isPending: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscription: Subscription | null = null;

  private args: Observable<any>[] = [];

  constructor(private depends: Observable<any>[], private getter: StateGetter<T>) {}

  public get(): Observable<T> {
    if (this.isWatching()) {
      return this.stateNotNull().pipe(take(1));
    } else {
      return this.doGet();
    }
  }

  public pending(): Observable<boolean> {
    return this.isPending;
  }

  public tick(): void {
    if (this.isWatching()) {
      this.doGet().subscribe();
    }
  }

  public watch(...args: Observable<any>[]): Observable<T> {
    this.args = args;

    return this.stateNotNull().pipe(
      startWith('_START_' as const),
      filter((a: '_START_' | T) => {
        const isStart: boolean = a === '_START_';
        if (isStart && !this.isWatching()) {
          this.doWatch();
        }

        return !isStart;
      }),
      map(a => a as T),
      finalize(() => {
        if (!this.state.observed) {
          this.unwatch();
        }
      })
    );
  }

  // =======================================================================================

  private isWatching() {
    return this.subscription !== null;
  }

  private doWatch() {
    this.subscription = this.combineAllArgs()
      .pipe(
        switchMap((args: any[]) => {
          return this.callGetter(args);
        })
      )
      .subscribe((rs: T) => {
        this.state.next(rs);
      });
  }

  private callGetter(args: any[]): Observable<T> {
    this.isPending.next(true);
    return this.getter(...args).pipe(tap(() => this.isPending.next(false)));
  }

  private unwatch() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private doGet() {
    return this.combineAllArgs().pipe(
      take(1),
      switchMap((args: any[]) => {
        return this.callGetter(args);
      }),
      tap((rs: T) => {
        this.state.next(rs);
      })
    );
  }

  private combineAllArgs(): Observable<any[]> {
    return combineLatest([...this.depends, ...this.args]);
  }

  private stateNotNull(): Observable<T> {
    return this.state.pipe(
      filter(s => {
        return s !== null;
      }),
      map(s => s as T)
    );
  }
}
