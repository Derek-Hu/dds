import { Observable } from 'rxjs';

export type StateGetter<T> = (...args: any[]) => Observable<T>;
export type ContractStateDefine = { _args: Observable<any>[]; _getter: StateGetter<any> };
