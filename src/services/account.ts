import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { Observable, of } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { CoinBalance } from '../wallet/contract-interface';
import { toEthers } from '../util/ethers';

/**
 * 用户是否已经连接账户地址
 * @return - boolean; true: 已经连接账户，false: 未连接;
 */
export const isUserConnected = async (): Promise<boolean> => {
  const address$: Observable<boolean> = walletManager.watchWalletInstance().pipe(
    switchMap((wallet: WalletInterface | null) => {
      return wallet === null ? of(null) : wallet.watchAccount();
    }),
    map((address: string | null): boolean => {
      return address !== null;
    }),
    take(1)
  );

  return address$.toPromise();
};

export const curUserAccount = async (): Promise<string | null> => {
  // return walletManager
  //   .watchWalletInstance()
  //   .pipe(
  //     switchMap((wallet: WalletInterface | null) => {
  //       return wallet === null ? of(null) : wallet.watchAccount();
  //     }),
  //     take(1)
  //   )
  //   .toPromise();
  return loginUserAccount();
};

/**
 * 登陆后得到用户地址，连接前阻塞不返回
 */
export const loginUserAccount = async (): Promise<string> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      filter((acc) => acc !== null),
      map((acc) => acc as string),
      take(1)
    )
    .toPromise();
};

/**
 * 用户已经连接后返回用户账户信息
 */
export const userAccountInfo = async (): Promise<UserAccountInfo> => {
  return walletManager
    .watchWalletInstance()
    .pipe(
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      filter((acc) => acc !== null),
      map((acc) => acc as string),
      switchMap((account: string) => {
        return contractAccessor.getUserSelfWalletBalance(account).pipe(
          map((balances: CoinBalance[]) => {
            return {
              address: account,
              USDBalance: balances.map((one) => ({
                coin: one.coin,
                amount: Number(toEthers(one.balance, 4, one.coin)),
              })),
            } as UserAccountInfo;
          })
        );
      }),
      take(1)
    )
    .toPromise();
};

userAccountInfo().then((rs) => {
  console.log('user rs', rs);
});
