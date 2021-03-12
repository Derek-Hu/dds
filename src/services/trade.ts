import { orders, balance, infoItems, curPrice, poolInfo } from './mock/trade.mock';
import { walletManager } from '../wallet/wallet-manager';
import { map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { contractAccessor } from '../wallet/chain-access';
import { of } from 'rxjs';
import { UserAccountInfo } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';

/**
 * 获取交易账户余额信息
 * @param coin - 当前币种
 */
export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      switchMap((address: string | null) => {
        return address === null ? of(null) : contractAccessor.watchUserAccount(address, coin);
      }),
      map(
        (accountInfo: UserAccountInfo | null): IBalanceInfo => {
          if (accountInfo === null) {
            return {
              balance: 0,
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
  return Promise.resolve(orders);
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return Promise.resolve(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradePoolInfo> => {
  return Promise.resolve(poolInfo);
};

export const deposit = async (amount: ICoinAmount): Promise<boolean> => {
  return Promise.resolve(true);
};

export const withdraw = async (amount: ICoinAmount): Promise<boolean> => {
  return Promise.resolve(true);
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return Promise.resolve(curPrice);
};

export const openOrder = async (orderParam: ITradeOpenParam): Promise<boolean> => {
  return Promise.resolve(true);
};

export const closeOrder = async (order: ITradeRecord): Promise<boolean> => {
  return Promise.resolve(true);
};

/**
 * Pool Page
 */
