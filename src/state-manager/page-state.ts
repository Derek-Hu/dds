import { PageState } from './interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class PageStateImp<T> implements PageState<T> {
  private readonly state: BehaviorSubject<T>;

  constructor(private defaultVal: T) {
    this.state = new BehaviorSubject<T>(defaultVal);
  }

  default(): T {
    return this.defaultVal;
  }

  set(state: T): void {
    this.state.next(state);
  }

  get(): T {
    return this.state.getValue();
  }

  watch(): Observable<T> {
    return this.state;
  }
}
