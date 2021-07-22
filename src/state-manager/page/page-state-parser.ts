import { PageState, PageStateDefine, PageStateDefineTree, PageStateTree } from '../interface';
import { PageStateImp } from './page-state';
import _ from 'lodash';
import { PAGE_STATE } from './page-state-def';

function isPageStateDefine(def: any): boolean {
  return _.has(def, '_default');
}

export function parsePageStateTreeDefine<D extends PageStateDefineTree>(defines: D): PageStateTree<D> {
  const rs = {} as any;

  const keys = Object.keys(defines) as (keyof D)[];
  keys.forEach(k => {
    const def: PageStateDefineTree | PageStateDefine<any> = defines[k];
    if (isPageStateDefine(def)) {
      rs[k] = convertPageState(def as PageStateDefine<any>);
    } else {
      rs[k] = parsePageStateTreeDefine(def as PageStateDefineTree);
    }
  });

  return rs as PageStateTree<D>;
}

export function convertPageState<T>(pageDefine: PageStateDefine<T>): PageState<T> {
  return new PageStateImp(pageDefine._default);
}

export const P = parsePageStateTreeDefine(PAGE_STATE);
