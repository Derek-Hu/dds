import { orders, balance, infoItems, curPrice, poolInfo } from './mock/trade.mock';
import { graphData } from './mock/trade-graph.mock';
import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { AsyncSubject, of, zip } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { ConfirmInfo, UserAccountInfo } from '../wallet/contract-interface';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';
import * as request from 'superagent';
import { withLoading } from './utils';

/**
 * Trade Page
 */

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getFundingBalanceInfo = async (coin: IUSDCoins): Promise<IBalanceInfo> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      filter(wallet => wallet !== null),
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      filter(userAddress => userAddress !== null),
      switchMap((userAddress: string | null) => {
        return userAddress === null ? of(null) : contractAccessor.watchUserAccount(userAddress, coin);
      }),
      filter(account => account !== null),
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

export const getMaxOpenAmount = async (
  coin: IUSDCoins,
  exchange: IExchangePair,
  availedAmount: number
): Promise<number> => {
  return contractAccessor
    .getMaxOpenAmount(coin, exchange, availedAmount)
    .pipe(
      map((num: BigNumber) => Number(toEthers(num, 0))),
      take(1)
    )
    .toPromise();
};

// 订单确认弹框中funding lock的值
export const getFundingLocked = async (coin: IUSDCoins, ethAmount: number): Promise<number> => {
  return contractAccessor
    .getFundingLockedAmount(coin, 'ETHDAI', ethAmount)
    .pipe(
      map((locked: BigNumber) => {
        return Number(toEthers(locked, 4));
      }),
      take(1)
    )
    .toPromise();
};

/**
 * 获取交易订单
 *
 * @param page
 * @param pageSize
 */
export const getTradeOrders = async (page: number, pageSize: number = 5): Promise<ITradeRecord[]> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      filter(walletIns => walletIns !== null),
      switchMap((walletIns: WalletInterface | null) => {
        return (walletIns as WalletInterface)?.watchAccount();
      }),
      filter(account => account !== null),
      take(1),
      switchMap((account: string | null) => {
        return contractAccessor.getPriceByETHDAI('DAI').pipe(
          switchMap(curPrice => {
            return contractAccessor.getUserOrders(account as string, curPrice, page, pageSize);
          })
        );
      }),
      take(1)
    )
    .toPromise();
};

export const getTradeInfo = async (coin: IUSDCoins): Promise<ITradeInfo[]> => {
  return returnVal(infoItems);
};

export const getTradeLiquidityPoolInfo = async (coin: IUSDCoins): Promise<ITradePoolInfo> => {
  const obs = [contractAccessor.getPubPoolInfo(coin), contractAccessor.getPrivatePoolInfo(coin)];
  return zip(...obs)
    .pipe(
      map((infoList: CoinAvailableInfo[]) => {
        return {
          public: infoList[0],
          private: infoList[1],
        };
      }),
      take(1)
    )
    .toPromise();
};

export const deposit = async (amount: IRecord): Promise<boolean> => {
  return withLoading(contractAccessor.depositToken(amount.amount, amount.coin).pipe(take(1)).toPromise());
};

export const withdraw = async (amount: IRecord): Promise<boolean> => {
  return withLoading(contractAccessor.withdrawToken(amount.amount, amount.coin).pipe(take(1)).toPromise());
};

export const getCurPrice = async (coin: IUSDCoins): Promise<number> => {
  return contractAccessor
    .getPriceByETHDAI(coin)
    .pipe(
      map(num => Number(toEthers(num, 4))),
      take(1)
    )
    .toPromise();
};

/**
 * 开仓下单操作
 * @param coin -
 * @param tradeType
 * @param amount - eth的数量
 */
export const openOrder = async (coin: IUSDCoins, tradeType: ITradeType, amount: number): Promise<boolean> => {
  return withLoading(contractAccessor.createContract(coin, tradeType, amount).pipe(take(1)).toPromise());
};

/**
 * 关仓操作
 * @param order - 订单对象，从返回的order列表中选取
 * @param closePrice - 用户看到并认可的的此刻价格
 */
export const closeOrder = async (order: ITradeRecord, closePrice: number): Promise<boolean> => {
  return withLoading(contractAccessor.closeContract(order, closePrice).pipe(take(1)).toPromise());
};

export const getPriceGraphData = (
  coins: { from: IFromCoins; to: IUSDCoins },
  duration: IGraphDuration
): Promise<IPriceGraph> => {
  const days = duration === 'day' ? 1 : duration === 'week' ? 7 : 30;

  const rs = new AsyncSubject<IPriceGraph>();
  request
    .get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=USD&days=' + days)
    .end((err, res) => {
      if (!err) {
        const obj = JSON.parse(res.text);
        const data: { timestamp: number; value: number }[] = obj.prices.map((el: number[]) => ({
          timestamp: el[0],
          value: el[1],
        }));
        const last: number = data[data.length - 1].value;
        const dataRs = {
          price: last,
          percentage: -14.2,
          range: 23,
          data: data,
        };
        rs.next(dataRs);
        rs.complete();
      }
    });
  return rs.toPromise();
};

/**
 * 订单确认页面显示数值
 * @param amount - eth amount
 * @param coin - DAI
 */
export const confirmOrder = async (amount: number, coin: IUSDCoins): Promise<any> => {
  return contractAccessor
    .confirmContract(amount, coin)
    .pipe(
      map((info: ConfirmInfo) => {
        return {
          curPrice: Number(toEthers(info.currentPrice, 4, coin)),
          settlementFee: Number(toEthers(info.exchgFee, 4, coin)),
          fundingFeeLocked: Number(toEthers(info.openFee, 4, coin)),
        };
      }),
      take(1)
    )
    .toPromise();
};
