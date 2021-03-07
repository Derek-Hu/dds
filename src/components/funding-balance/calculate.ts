export const getMaxFromCoin = (balanceInfo?: IBalanceInfo, price?: number) => {
    if(!balanceInfo){
        return;
    }
    if(typeof price !== 'number') {
        return;
    }
    const { balance, locked } = balanceInfo;

    return (balance - locked)/price;
}

export const getFee = (amount: any | undefined, price: any) => {
    if(typeof amount !== 'number') {
        return;
    }
    if(typeof price !== 'number') {
        return;
    }
    return amount * price / 1000;
}

// TODO
export const getLocked = (amount: any | undefined, price: any | undefined) => {
    if(typeof amount !== 'number') {
        return;
    }
    if(typeof price !== 'number') {
        return;
    }
    return amount * price / 1000;
}