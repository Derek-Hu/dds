import { orders, balance, infoItems, curPrice, poolInfo } from './mock/trade.mock';
import { graphData } from './mock/trade-graph.mock';
import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { of } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { UserAccountInfo } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';

/**
 * Trade Page
 */

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      filter((wallet) => wallet !== null),
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      filter((userAddress) => userAddress !== null),
      switchMap((userAddress: string | null) => {
        return userAddress === null ? of(null) : contractAccessor.watchUserAccount(userAddress, coin);
      }),
      filter((account) => account !== null),
      map(
        (accountInfo: UserAccountInfo | null): IBalanceInfo => {
          if (accountInfo === null) {
            return {
              balance: -1,
              locked: 0,
            };
          } else {
            const deposit: BigNumber = accountInfo.deposit;
            const availed: BigNumber = accountInfo.available;
            const locked: BigNumber = deposit.sub(availed);

            return {
              balance: Number(toEthers(deposit, 4)),
              locked: Number(toEthers(locked, 4)),
              available: Number(toEthers(availed, 4)),
            } as IBalanceInfo;
          }
        }
      ),
      take(1)
    )
    .toPromise();
};

export const getTradeOrders = async (page: number, pageSize = 10): Promise<ITradeRecord[]> => {
  return returnVal(orders);
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return returnVal(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradePoolInfo> => {
  return returnVal(poolInfo);
};

export const deposit = async (amount: IRecord): Promise<boolean> => {
  return contractAccessor.depositToken(amount.amount, amount.coin).pipe(take(1)).toPromise();
};

export const withdraw = async (amount: IRecord): Promise<boolean> => {
  return contractAccessor.withdrawToken(amount.amount, amount.coin).pipe(take(1)).toPromise();
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return contractAccessor
    .getPriceByETHDAI(coin)
    .pipe(
      map((num) => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

export const openOrder = async (orderParam: ITradeOpenParam): Promise<boolean> => {
  return returnVal(true);
};

export const getPriceGraphData = (
  coins: { from: IFromCoins; to: IUSDCoins },
  duration: IGraphDuration
): Promise<IPriceGraph> => {
  return returnVal(graphData);
};
/**
 * Pool Page
 */
