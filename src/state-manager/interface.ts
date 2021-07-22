import { Observable } from 'rxjs';

export type StateGetter<T> = (...args: any[]) => Observable<T>;

export interface StateReference {
  getRef(): Observable<any>;

  setRoot(root: ContractStateTree<any>): this;
}

export type Watchable = { watch: () => Observable<any> };

// ---------------------------------------------------------------------------------------------------------------------
// Contract State

export type ContractStateDefine<T> = {
  _depend: (Observable<any> | StateReference | Watchable)[];
  _getter: StateGetter<T>;
};

export type ContractStateType<T extends ContractStateDefine<any>> = ReturnType<T['_getter']> extends Observable<infer D>
  ? D
  : never;

export type ContractArgsType<T extends ContractStateDefine<any>> = T extends { _args: Observable<infer A>[] }
  ? Observable<A>[]
  : [];

export type ContractStateDefineTree = { [p: string]: ContractStateDefine<any> | ContractStateDefineTree };

export interface ContractState<T> {
  watch(): Observable<T>;

  get(): Observable<T>;

  pending(): Observable<boolean>;

  tick(): void;

  debug(label?: string): this;
}

export type ContractStateOfDefine<D extends ContractStateDefine<any>> = ContractState<ContractStateType<D>>;

export type ContractStateTree<D extends ContractStateDefineTree> = {
  [p in keyof D]: D[p] extends ContractStateDefine<any>
    ? ContractStateOfDefine<D[p]>
    : D[p] extends ContractStateDefineTree
    ? ContractStateTree<D[p]>
    : never;
};

// ------------------------------------------------------------------------------------------------
// Page State

export type PageStateDefine<T> = { _default: T; _serializer?: (s: T) => string };
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

  setToDefault(): void;

  get(): T;

  default(): T;

  watch(): Observable<T>;
}

// ----------------------------------------------------------------------------
// Cache State
export type CacheSerializer<T> = (state: T | null) => string | null;
export type CacheParser<T> = (stateStr: string | null) => T | null;
export type CachePatcher<T> = (oldState: T | null, newState: T | null) => T | null;

export interface CacheStateDefine<T> {
  _key: string;
  _parser: CacheParser<T>;
  _serializer: CacheSerializer<T>;
  _patcher?: CachePatcher<T>;
}

export type CacheStateDefineTree = { [p: string]: CacheStateDefine<any> | CacheStateDefineTree };
export type CacheStateTree<D extends CacheStateDefineTree> = {
  [p in keyof D]: D[p] extends CacheStateDefine<infer S>
    ? CacheState<S>
    : D[p] extends CacheStateDefineTree
    ? CacheStateTree<D[p]>
    : never;
};

export interface CacheState<T> {
  getKey(): string;

  set(state: T | null): void;

  patch(state: T | null): void;

  get(): Observable<T | null>;

  watch(): Observable<T | null>;
}

// ----------------------------------------------------------------------------
// Database State

export interface DatabaseState<T> {
  watch(): Observable<T>;

  tick(): void;
}

export interface DatabaseStateMerger<T, A extends readonly any[]> {
  mergeWatch(...args: A): Observable<T>;
}

export interface DatabaseStateDefine<T> {
  _depend: (Observable<any> | Watchable)[];
  _merger: DatabaseStateMerger<T, any[]>;
}

export type DatabaseStateDefineTree = { [p: string]: DatabaseStateDefine<any> | DatabaseStateDefineTree };
export type DatabaseStateTree<D extends DatabaseStateDefineTree> = {
  [p in keyof D]: D[p] extends DatabaseStateDefine<infer S>
    ? DatabaseState<S>
    : D[p] extends DatabaseStateDefineTree
    ? DatabaseStateTree<D[p]>
    : never;
};
