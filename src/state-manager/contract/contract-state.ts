import { ContractState, StateGetter } from '../interface';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, filter, finalize, map, startWith, switchMap, take, tap } from 'rxjs/operators';

export class ContractStateImp<T> implements ContractState<T> {
  private state: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  private isPending: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscription: Subscription | null = null;

  private isDebug: boolean = false;
  private debugLabel: string | null = null;
  private debugSub: Subscription | null = null;

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

  public watch(): Observable<T> {
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
      tap(a => {
        if (this.isDebug) {
          console.log(this.debugLabel ? this.debugLabel : '', 'new state is', a);
        }
      }),
      finalize(() => {
        if (!this.state.observed) {
          this.unwatch();
        }
      })
    );
  }

  public debug(label?: string): this {
    this.isDebug = true;
    this.debugLabel = label ? label : null;

    return this;
  }

  // =======================================================================================

  private isWatching() {
    return this.subscription !== null;
  }

  private doWatch() {
    if (this.isDebug) {
      this.debugSub = merge(...this.depends)
        .pipe(
          tap((arg: any) => {
            console.log(this.debugLabel ? this.debugLabel : '', 'a state state arg', arg);
          })
        )
        .subscribe();
    }

    this.subscription = this.combineAllArgs()
      .pipe(
        debounceTime(10),
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

    if (this.debugSub) {
      this.debugSub.unsubscribe();
      this.debugSub = null;
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
    return combineLatest(this.depends);
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
