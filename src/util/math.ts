import numeral from 'numeral';

export const format = (value: any) => {
  if(isNumberLike(value)){
    return numeral(parseFloat(value)).format('0,0.0000');
  }
  return '';
};

export const formatInt = (value: any) => {
  if (typeof value !== 'number') {
    return value;
  }
  return numeral(value).format('0,0');
};

export const percentage = (fenzi: any, fenmu: any) => {
  if (typeof fenzi !== 'number') {
    return;
  }
  if (typeof fenmu !== 'number') {
    return;
  }
  return numeral((100 * fenzi) / fenmu).format('0,0.0000');
};

export const dividedPecent = (fenzi: any, fenmu: any) => {
    if(isNumberLike(fenzi) && isNumberLike(fenmu)){
      return 100 * parseFloat(fenzi)/parseFloat(fenmu);
    }
    return;
}


export const isNumberLike = (value: string | number | null | undefined) => {
    if(value===null || value ===undefined){
      return false;
    }
    if (typeof value === 'number'){
      return true;
    }
    if(String(parseFloat(value))===value){
      return true;
    }
    return false;
  }

export const isNotZeroLike = (value: any) => {
    return isNumberLike(value) && String(value) !== '0';
}
