import { Observable } from 'rxjs';

export type StateGetter<T> = (...args: any[]) => Observable<T>;
export type ContractStateDefine<T> = {
  _depend: Observable<any>[];
  _getter: StateGetter<T>;
};
export type ContractStateDefineTree = { [p: string]: ContractStateDefine<any> | ContractStateDefineTree };

export interface ContractState<T> {
  watch(...args: Observable<any>[]): Observable<T>;

  get(): Observable<T>;

  pending(): Observable<boolean>;

  tick(): void;
}

export type ContractStateType<T extends ContractStateDefine<any>> = ReturnType<T['_getter']> extends Observable<infer D>
  ? D
  : never;
export type ContractStateGetterArgType<T extends ContractStateDefine<any>> = Parameters<T['_getter']>;
export type ContractStateDependArgType<T extends ContractStateDefine<any>> = T['_depend'];
export type ContractStateWatchArgType<T extends ContractStateDefine<any>> = ContractStateGetterArgType<T>;

export type ContractStateTree<D extends ContractStateDefineTree> = {
  [p in keyof D]: D[p] extends ContractStateDefine<infer S>
    ? ContractState<S>
    : D[p] extends ContractStateDefineTree
    ? ContractStateTree<D[p]>
    : never;
};

export type PageStateDefine<T> = { _default: T; _serializer: (s: T) => string };
export type PageStateDefineTree = { [p: string]: PageStateDefine<any> | PageStateDefineTree };
export type PageStateTree<D extends PageStateDefineTree> = {
  [p in keyof D]: D[p] extends PageStateDefine<infer S>
    ? PageState<S>
    : D[p] extends PageStateDefineTree
    ? PageStateTree<D[p]>
    : never;
};

export interface PageState<T> {
  set(state: T): void;

  default(): T;

  watch(): Observable<T>;

  serialize(): Observable<string>;
}
