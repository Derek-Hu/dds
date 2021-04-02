import { contractAccessor } from '../wallet/chain-access';
import { map, switchMap, take } from 'rxjs/operators';
import { CoinBalance } from '../wallet/contract-interface';
import { toEthers } from '../util/ethers';
import { withLoading } from './utils';
import { loginUserAccount } from './account';
import { from } from 'rxjs';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getSwapPrice = async (): Promise<ISwapBurn> => {
  return contractAccessor
    .getSwapBurnInfo()
    .pipe(
      map((info: CoinBalance[]) => {
        const rs: { [c: string]: number } = {};
        info.forEach((one: CoinBalance) => {
          rs[one.coin.toString()] = Number(toEthers(one.balance, 0, one.coin));
        });
        return rs;
      }),
      map(info => {
        const ddsAmount: number = info['SLD'] / 10;
        const usdAmount: number = info['DAI'] + info['USDT'] + info['USDC'];
        const price: number = usdAmount / ddsAmount;

        return {
          usd: usdAmount,
          dds: ddsAmount,
          rate: price,
        };
      }),
      take(1)
    )
    .toPromise();
};

export const conformSwap = async (data: IRecord): Promise<boolean> => {
  const doSwap = async (): Promise<boolean> => {
    const swapRs: Promise<boolean> = from(loginUserAccount())
      .pipe(
        switchMap(account => {
          return contractAccessor.doSwap(account, data.coin, data.amount);
        }),
        take(1)
      )
      .toPromise();

    return withLoading(swapRs);
  };

  return await doSwap();
};
