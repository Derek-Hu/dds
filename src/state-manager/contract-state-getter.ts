import { from, NEVER, Observable, of } from 'rxjs';
import { BigNumber, Contract } from 'ethers';
import { map, take } from 'rxjs/operators';
import { UserTradeAccountInfo } from './contract-state-types';
import { getTradePairSymbol, TOKEN_SYMBOL } from '../constant/tokens';
import { PageTradingPair, TradeDirection } from './page-state-types';

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
export function tradePriceGetter(contract: Contract, baseCoin: symbol): Observable<BigNumber> {
  if (baseCoin === TOKEN_SYMBOL.ETH) {
    return from(contract.getPriceByETHDAI() as Promise<BigNumber>).pipe(take(1));
  }
  return of(BigNumber.from(0));
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
