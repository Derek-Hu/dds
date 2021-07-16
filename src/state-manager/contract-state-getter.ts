import { from, NEVER, Observable, of } from 'rxjs';
import { BigNumber, Contract } from 'ethers';
import { map, take } from 'rxjs/operators';
import { TradeOrderFees, UserTradeAccountInfo } from './contract-state-types';
import { getTradePairSymbol, TOKEN_SYMBOL } from '../constant/tokens';
import { PageTradingPair, TradeDirection } from './page-state-types';
import { tokenBigNumber } from '../util/ethers';

// balance in erc20
export function walletBalanceGetter(contract: Contract, address: string): Observable<BigNumber> {
  return from(contract.balanceOf(address) as Promise<BigNumber>).pipe(take(1));
}

// user funding balance
export function userTradeAccountGetter(contract: Contract, address: string): Observable<UserTradeAccountInfo> {
  return from(contract.userAccount(address) as Promise<BigNumber[]>).pipe(
    map((rs: BigNumber[]) => {
      return {
        balance: rs[0],
        available: rs[1],
        locked: rs[0].sub(rs[1]),
      };
    })
  );
}

// get trading price of trading pair
export function tradePriceGetter(contract: Contract, baseCoin: symbol, quoteCoin: symbol): Observable<BigNumber> {
  return tradePairPriceGetter(contract, { base: baseCoin, quote: quoteCoin });
}

export function tradePairPriceGetter(contract: Contract, tradePair: PageTradingPair): Observable<BigNumber> {
  const pairSymbol: symbol | null = getTradePairSymbol(tradePair.base, tradePair.quote);
  const pairName: string | undefined = pairSymbol !== null ? pairSymbol.description : undefined;
  const apiName: string = 'getPriceBy' + (pairName || 'ETHDAI');
  return from(contract[apiName]() as Promise<BigNumber>).pipe(take(1));
}

// get order max open amount.
export function maxOpenAmountGetter(
  contract: Contract,
  tradeDir: TradeDirection,
  tradePair: PageTradingPair,
  accountInfo: UserTradeAccountInfo
): Observable<BigNumber> {
  const tradePairSymbol: symbol | null = getTradePairSymbol(tradePair.base, tradePair.quote);

  if (!tradePairSymbol) {
    console.log('there is no trade pair when getting max open amount.');
    return NEVER;
  }

  const tradeDirSign = tradeDir === 'LONG' ? 1 : 2;
  return from(
    contract.getMaxOpenAmount(
      tradePairSymbol.description,
      accountInfo.available,
      BigNumber.from(tradeDirSign)
    ) as Promise<BigNumber>
  );
}

/**
 * get open order fees
 * @param contract
 * @param openAmount
 * @param tradePair
 * @param direction
 */
export function tradeFeeGetter(
  contract: Contract,
  openAmount: number,
  tradePair: PageTradingPair,
  direction: TradeDirection
): Observable<TradeOrderFees> {
  const pairSymbol: symbol | null = getTradePairSymbol(tradePair.base, tradePair.quote);
  const pairStr: string | undefined = pairSymbol ? pairSymbol.description : undefined;
  const directSign: BigNumber = direction === 'LONG' ? BigNumber.from(1) : BigNumber.from(2);
  const amount: BigNumber = tokenBigNumber(openAmount, tradePair.base); // base coin amount
  type Rs = {
    currentPrice: BigNumber;
    exchgFee: BigNumber;
    openFee: BigNumber;
    total: BigNumber;
  };
  return from(contract.fees(pairStr, amount, directSign) as Promise<Rs>).pipe(
    map((fees: Rs) => {
      return {
        curPrice: fees.currentPrice,
        totalFee: fees.total,
        settlementFee: fees.exchgFee,
        fundingLocked: fees.openFee,
      };
    })
  );
}
