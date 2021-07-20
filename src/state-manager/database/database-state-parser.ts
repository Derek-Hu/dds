import { DatabaseState, DatabaseStateDefine, DatabaseStateDefineTree, DatabaseStateTree } from '../interface';
import { DatabaseStateImp } from './database-state';
import { isObservable, NEVER, Observable } from 'rxjs';
import _ from 'lodash';
import { DATABASE_STATE } from './database-state-def';

function isDatabaseStateDefine(def: any): boolean {
  return _.has(def, '_merger') && _.has(def, '_depend');
}

export function parseDatabaseStateDefine<D extends DatabaseStateDefineTree>(
  defines: D
): Observable<DatabaseStateTree<D>> {
  const res = {} as any;

  const keys = Object.keys(defines) as (keyof D)[];
  keys.forEach(key => {
    const def: DatabaseStateDefine<any> | DatabaseStateDefineTree = defines[key];
    if (isDatabaseStateDefine(def)) {
      res[key] = convertDatabaseState(def as DatabaseStateDefine<any>);
    } else {
      res[key] = parseDatabaseStateDefine(def as DatabaseStateDefineTree);
    }
  });

  return res as Observable<DatabaseStateTree<D>>;
}

export function convertDatabaseState<T>(define: DatabaseStateDefine<T>): DatabaseState<T> {
  const obs: Observable<any>[] = define._depend.map(one => {
    if (isObservable(one)) {
      return one;
    } else if (_.has(one, 'watch')) {
      return one.watch();
    } else {
      return NEVER;
    }
  });

  return new DatabaseStateImp(define._merger, obs);
}

export const D = parseDatabaseStateDefine(DATABASE_STATE);
