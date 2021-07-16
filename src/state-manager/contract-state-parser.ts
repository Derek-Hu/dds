import {
  ContractStateDefine,
  ContractStateDefineTree,
  ContractStateOfDefine,
  ContractStateTree,
  StateReference,
  Watchable,
} from './interface';
import { ContractStateImp } from './contract-state';
import _ from 'lodash';
import { isObservable, Observable } from 'rxjs';
import { CONTRACT_STATE } from './contract-state-def';

function isStateDefine(define: any) {
  return _.has(define, '_getter') && _.has(define, '_depend');
}

function isWatchable(depend: any) {
  return _.hasIn(depend, 'watch');
}

export function parseContractStateDefine<D extends ContractStateDefineTree>(
  defineTree: D,
  root?: ContractStateTree<D>
): ContractStateTree<D> {
  const res: any = {};
  if (!root) {
    root = res;
  }

  const keys = Object.keys(defineTree) as (keyof D)[];
  keys.forEach(k => {
    const def: ContractStateDefine<any> | ContractStateDefineTree = defineTree[k];

    if (isStateDefine(def)) {
      const define = def as ContractStateDefine<any>;
      res[k] = convertContractState(define, root as ContractStateTree<D>) as ContractStateOfDefine<typeof define>;
    } else {
      res[k] = parseContractStateDefine(def as ContractStateDefineTree, root);
    }
  });

  return res as ContractStateTree<D>;
}

export function convertContractState<T extends ContractStateDefine<any>>(
  define: T,
  root: ContractStateTree<any>
): ContractStateOfDefine<T> {
  const dependArgs: Observable<any>[] = define._depend.map(one => {
    if (isObservable(one)) {
      return one;
    } else if (isWatchable(one)) {
      return (one as Watchable).watch();
    } else {
      return (one as StateReference).setRoot(root).getRef();
    }
  });

  return new ContractStateImp(dependArgs, define._getter);
}

export const S = parseContractStateDefine(CONTRACT_STATE);
