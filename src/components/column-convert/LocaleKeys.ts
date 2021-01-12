export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type LocaleKeys<T> = keyof NonFunctionPropertyNames<T>;
