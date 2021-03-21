import { Decimal } from 'decimal.js';
import numeral from 'numeral';

export const format = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).toFixed(4)).format('0,0.0000');
  }
  return '';
};

export const multiple = (one: any, two: any) => {
  if (isNumberLike(one) && isNumberLike(two)) {
    return new Decimal(Number(one)).times(Number(two)).toNumber();
  }
  return NaN;
};
export const formatInt = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).truncated()).format('0,0');
  }
  return '';
};

export const percentage = (fenzi: any, fenmu: any) => {
  if (isNumberLike(fenzi) && isNumberLike(fenmu)) {
    return new Decimal(Number(fenzi)).times(100).div(Number(fenmu)).toFixed(2);
  }
  return '';
};

export const dividedPecent = (fenzi: any, fenmu: any) => {
  if (isNumberLike(fenzi) && isNumberLike(fenmu)) {
    return new Decimal(Number(fenzi)).times(100).div(Number(fenmu)).toNumber();
  }
  return;
};

export const isNumberLike = (value: any) => {
  return String(Number(value)) === String(value);
};

export const isNotZeroLike = (value: any) => {
  return isNumberLike(value) && String(value) !== '0';
};
