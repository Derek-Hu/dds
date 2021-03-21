import { Decimal } from 'decimal.js';

export const format = (value: any) => {
  if (isNumberLike(value)) {
    return new Decimal(new Decimal(value).toFixed(4)).toFraction(10000);
  }
  return '';
};

export const formatInt = (value: any) => {
  if (isNumberLike(value)) {
    return new Decimal(value).truncated().toFraction(10000);
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
