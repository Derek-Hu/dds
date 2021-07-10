// for state cache

import { AsyncSubject, EMPTY, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  CoinBalance,
  CoinShare,
  ContractRead,
  PrivatePoolAccountInfo,
  PubPoolLockInfo,
  PubPoolRewards,
} from './contract-interface';
import { contractAccessor } from './chain-access';
import _ from 'lodash';

export class QueryMergeManager implements ContractRead {
  private pendingMap: Map<string, AsyncSubject<any>> = new Map<string, AsyncSubject<any>>();
  private functionMap: Map<string, Function> = new Map<string, Function>();

  public constructor() {
    this.registerFunction('priPoolUserBalance', (args: any[]) => contractAccessor.priPoolUserBalance(args[0]));
    this.registerFunction('getReTokenLiquidityReward', (args: any[]) =>
      contractAccessor.getReTokenLiquidityReward(args[0])
    );
    this.registerFunction('getUserSelfReTokenBalance', (args: any[]) =>
      contractAccessor.getUserSelfReTokenBalance(args[0])
    );
    this.registerFunction('getUserSelfWalletBalance', (args: any[]) =>
      contractAccessor.getUserSelfWalletBalance(args[0])
    );
    this.registerFunction('getPubPoolLiquidityShareInfo', (args: any[]) =>
      contractAccessor.getPubPoolLiquidityShareInfo(args[0])
    );
    this.registerFunction('getUserReTokenShareInfo', (args: any[]) =>
      contractAccessor.getUserReTokenShareInfo(args[0])
    );
  }

  public registerFunction(funName: string, fun: Function) {
    this.functionMap.set(funName, fun);
  }

  public autoRegisterFunction(funName: string): void {
    if (this.functionMap.has(funName)) {
      return;
    }

    const fun = _.get(contractAccessor, funName) as Function;
    const realFun = fun.bind(contractAccessor);

    this.functionMap.set(funName, realFun);
  }

  public callFunction<T>(funName: string, args: any[]): Observable<T> {
    this.autoRegisterFunction(funName);

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

  public getReTokenLiquidityReward(address: string): Observable<PubPoolRewards> {
    return this.callFunction<PubPoolRewards>('getReTokenLiquidityReward', [address]);
  }

  public getUserSelfReTokenBalance(address: string): Observable<CoinBalance[]> {
    return this.callFunction<CoinBalance[]>('getUserSelfReTokenBalance', [address]);
  }

  public getUserSelfWalletBalance(address: string): Observable<CoinBalance[]> {
    return this.callFunction<CoinBalance[]>('getUserSelfWalletBalance', [address]);
  }

  public getPubPoolLiquidityShareInfo(address: string): Observable<PubPoolLockInfo> {
    return this.callFunction<PubPoolLockInfo>('getPubPoolLiquidityShareInfo', [address]);
  }

  public getUserReTokenShareInfo(address: string): Observable<CoinShare[]> {
    return this.callFunction<CoinShare[]>('getUserReTokenShareInfo', [address]);
  }
}

export const queryMan = new QueryMergeManager();
