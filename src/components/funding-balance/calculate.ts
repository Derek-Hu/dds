export const getMaxFromCoin = (balanceInfo: IBalanceInfo | null | undefined, price: number) => {
    if(!balanceInfo){
        return 0;
    }
    const { balance, locked } = balanceInfo;

    return (balance - locked)/price;
}

export const getFee = (amount: number | null | undefined, price: number) => {
    if(amount === undefined || amount === null) {
        return 0;
    }
    return amount * price / 1000;
}

// TODO
export const getLocked = (amount: number | null | undefined, price: number) => {
    if(amount === undefined || amount === null) {
        return 0;
    }
    return amount * price / 1000;
}