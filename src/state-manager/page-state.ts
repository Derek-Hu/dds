import { PageState } from './interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class PageStateImp<T> implements PageState<T> {
  private readonly state: BehaviorSubject<T>;

  constructor(private defaultVal: T, private serializer: (s: T) => string) {
    this.state = new BehaviorSubject<T>(defaultVal);
  }

  default(): T {
    return this.defaultVal;
  }

  set(state: T): void {
    this.state.next(state);
  }

  watch(): Observable<T> {
    return this.state;
  }

  serialize(): Observable<string> {
    return this.watch().pipe(map(state => this.serializer(state)));
  }
}
