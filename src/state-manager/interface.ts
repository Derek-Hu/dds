import { Observable } from 'rxjs';

export type StateGetter<T> = (...args: any[]) => Observable<T>;

export interface StateReference {
  getRef(): Observable<any>;

  setRoot(root: ContractStateTree<any>): this;
}

export type Watchable = { watch: () => Observable<any> };

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

  get(): T;

  default(): T;

  watch(): Observable<T>;
}
