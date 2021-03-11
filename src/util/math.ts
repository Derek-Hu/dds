import numeral from 'numeral';

export const format = (value: any) => {
    if(typeof value !== 'number'){
        return;
    }
    return numeral(value).format('0,0.0000');
}

export const percentage = (fenzi: any, fenmu: any) => {
    if(typeof fenzi !== 'number'){
        return;
    }
    if(typeof fenmu !== 'number'){
        return;
    }
    return numeral(100 * fenzi / fenmu).format('0,0.0000');
}

export const dividedPecent = (fenzi: any, fenmu: any) => {
    return 100 * fenzi/fenmu;
}