import { Decimal } from 'decimal.js';
import numeral from 'numeral';

export const format = (value: any) => {
  if (isNumberLike(value)) {
    return numeral(new Decimal(value).toFixed(4)).format('0,0.0000');
  }
  return '';
};

export const multiple = (one: any, two: any, original?: boolean) => {
  if (isNumberLike(one) && isNumberLike(two)) {
    const val = new Decimal(Number(one)).times(Number(two)).toNumber();
    if(original){
      return val;
    }
    const res = Number(new Decimal(val).toFixed(4));
    return isNaN(res)? NaN : res;
  }
  return NaN;

};

export const minus = (one: any, two: any, original?: boolean) => {
  if (isNumberLike(one) && isNumberLike(two)) {
    const val = new Decimal(Number(one)).minus(Number(two)).toNumber();
    if(original){
      return val;
    }
    const res = Number(new Decimal(val).toFixed(4));
    return isNaN(res)? NaN : res;
  }
  return NaN;
};

export const divide = (one: any, two: any) => {
  if (isNumberLike(one) && Number(one) === 0){
    return 0;
  }
  if (isNumberLike(one) && isNumberLike(two)) {
    const value = Number(new Decimal(Number(one)).div(Number(two)).toFixed(4));
    return isNaN(value)? NaN : value;
  }
  return NaN;
};

export const truncated = (value: any) => {
  if (isNumberLike(value)) {
    return Number(new Decimal(value).toFixed(4));
  }
  return;
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

export const isGreaterZero = (value: any) => {
  return isNumberLike(value) && Number(value) > 0;
};


