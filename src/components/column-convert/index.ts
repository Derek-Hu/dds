
import * as React from 'react';
import { NonFunctionPropertyNames } from './LocaleKeys';

const defaultRender = (val: any) => val;

interface IAttribute {
  [key: string]: any;
}

export interface ISettings<T, A> {
  column: Partial<Record<NonFunctionPropertyNames<T & A>, string | React.ReactNode>>;
  render: (value: any, key: NonFunctionPropertyNames<T & A>, record: T, instance?: React.Component, index?: number) => React.ReactNode;
  attributes?: Partial<Record<NonFunctionPropertyNames<T & A>, IAttribute>>;
}

/**
 * U: Table Row Object
 *
 * A: Additional Columns
 */

/**
 * 为了实现不指定范型则报错的效果，加上了string类型
 *
 */
export default <U = string, A = {}>(settings: ISettings<U, A>, instance?: React.Component) => {
  const attributes = settings.attributes || {};
  return Object.keys(settings.column).map(key => ({
    // @ts-ignore
    ...attributes[key],
    // @ts-ignore
    title: settings.column[key],
    dataIndex: key,
    key,
    render: (text: any, record: U, index: number) => {
      // @ts-ignore
      return settings.render ? settings.render(text, key, record, instance, index) : defaultRender(text);
    },
  }));
};
