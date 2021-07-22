import _ from 'lodash';

export function isWatchable(obj: any): boolean {
  return _.hasIn(obj, 'watch');
}

export function isDatabaseStateDefine(def: any): boolean {
  return _.has(def, '_merger') && _.has(def, '_depend');
}
