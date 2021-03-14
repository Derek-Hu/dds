import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { Observable, of } from 'rxjs';

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
  return walletManager
    .watchWalletInstance()
    .pipe(
      switchMap((wallet: WalletInterface | null) => {
        return wallet === null ? of(null) : wallet.watchAccount();
      }),
      take(1)
    )
    .toPromise();
};

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
