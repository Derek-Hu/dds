// for state cache

import { AsyncSubject, EMPTY, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ContractRead, PrivatePoolAccountInfo } from './contract-interface';
import { contractAccessor } from './chain-access';

export class QueryMergeManager implements ContractRead {
  private pendingMap: Map<string, AsyncSubject<any>> = new Map<string, AsyncSubject<any>>();
  private functionMap: Map<string, Function> = new Map<string, Function>();

  public constructor() {
    this.registerFunction('priPoolUserBalance', (args: any[]) => contractAccessor.priPoolUserBalance(args[0]));
  }

  public registerFunction(funName: string, fun: Function) {
    this.functionMap.set(funName, fun);
  }

  public callFunction<T>(funName: string, args: any[]): Observable<T> {
    if (!this.functionMap.has(funName)) {
      return EMPTY;
    }

    if (this.pendingMap.has(funName)) {
      return this.pendingMap.get(funName) as AsyncSubject<T>;
    }

    this.pendingMap.set(funName, new AsyncSubject<T>());

    const fun = this.functionMap.get(funName) as Function;
    const resObs: Observable<T> = fun(args);

    const pendingCache = this.pendingMap.get(funName) as AsyncSubject<T>;
    resObs
      .pipe(
        finalize(() => {
          this.pendingMap.delete(funName);
        })
      )
      .subscribe(pendingCache);

    return pendingCache;
  }

  public priPoolUserBalance(address: string): Observable<PrivatePoolAccountInfo> {
    return this.callFunction<PrivatePoolAccountInfo>('priPoolUserBalance', [address]);
  }
}

export const queryMan = new QueryMergeManager();
