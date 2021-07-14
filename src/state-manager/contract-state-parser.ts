import {
  ContractState,
  ContractStateDefine,
  ContractStateDefineTree,
  ContractStateTree,
  ContractStateType,
} from './interface';
import { ContractStateImp } from './contract-state';
import _ from 'lodash';
import { CONTRACT_STATE } from './contract-state-def';

function isStateDefine(define: any) {
  return _.has(define, '_getter') && _.has(define, '_depend');
}

export function parseContractStateDefine<D extends ContractStateDefineTree>(defineTree: D): ContractStateTree<D> {
  const res: any = {};

  const keys = Object.keys(defineTree) as (keyof D)[];
  keys.forEach(k => {
    const def: ContractStateDefine<any> | ContractStateDefineTree = defineTree[k];

    if (isStateDefine(def)) {
      const define = def as ContractStateDefine<any>;
      res[k] = convertContractState(define) as ContractState<ContractStateType<typeof define>>;
    } else {
      res[k] = parseContractStateDefine(def as ContractStateDefineTree);
    }
  });

  return res as ContractStateTree<D>;
}

export function convertContractState<T>(define: ContractStateDefine<T>): ContractState<T> {
  return new ContractStateImp(define._depend, define._getter);
}
