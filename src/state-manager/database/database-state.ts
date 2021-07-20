import { DatabaseState, DatabaseStateMerger } from '../interface';
import { BehaviorSubject, combineLatest, merge, NEVER, Observable, of, Subject, Subscription, switchMap } from 'rxjs';
import { debounceTime, filter, finalize, map, tap } from 'rxjs/operators';

export class DatabaseStateImp<T> implements DatabaseState<T> {
  private state: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(null);
  private tickEvent: Subject<any> = new Subject<any>();
  private lastArgs: any[] | null = null;
  private subscription: Subscription | null = null;

  constructor(private merger: DatabaseStateMerger<T, any[]>, private depends: Observable<any>[]) {}

  tick(): void {
    if (this.isWatching()) {
      this.tickEvent.next(true);
    }
  }

  watch(): Observable<T> {
    return of(true).pipe(
      switchMap(() => {
        if (!this.isWatching()) {
          this.doWatch();
        }
        return this.state;
      }),
      filter(state => state !== null),
      map(state => state as T),
      finalize(() => {
        if (!this.state.observed) {
          this.unwatch();
        }
      })
    );
  }

  // ==================================================================
  // Privates

  private isWatching(): boolean {
    return this.subscription !== null;
  }

  private doWatch() {
    this.unwatch();
    this.subscription = this.watchArgs()
      .pipe(
        switchMap((args: any[]) => {
          return this.merger.mergeWatch(...args);
        })
      )
      .subscribe((state: T) => {
        this.state.next(state);
      });
  }

  private unwatch() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private combineAllArgs(): Observable<any[]> {
    return combineLatest(this.depends).pipe(tap(args => (this.lastArgs = args)));
  }

  private watchArgs(): Observable<any[]> {
    const tickArgs = this.tickEvent.pipe(
      map(() => this.lastArgs),
      filter(one => one !== null),
      map(one => one as any[])
    );
    return merge(this.combineAllArgs(), tickArgs).pipe(debounceTime(10));
  }
}
