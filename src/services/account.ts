import { walletManager } from '../wallet/wallet-manager';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WalletInterface } from '../wallet/wallet-interface';
import { combineLatest, firstValueFrom, NEVER, Observable, of, Subject, zip } from 'rxjs';
import { contractAccessor } from '../wallet/chain-access';
import { CoinBalance } from '../wallet/contract-interface';
import { toEthers } from '../util/ethers';
import { Wallet } from '../constant';
import { EthNetwork } from '../constant/network';

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

  return firstValueFrom(address$);
};

/**
 * 网页初始加载时候测试连接钱包
 */
export const initTryConnect = async (): Promise<boolean> => {
  // return new Promise(resolve => {
  //   setTimeout(()=>{
  //     resolve(true);
  //   }, 6000);
  // })
  const res = walletManager.initTryWallet().pipe(
    map((wallet: Wallet[]) => {
      return wallet.length === 0 ? false : true;
    })
  );
  return firstValueFrom(res);
};

/**
 * 登陆后得到用户地址，连接前阻塞不返回
 */
export const loginUserAccount = async (): Promise<string> => {
  const res = walletManager.watchWalletInstance().pipe(
    switchMap((wallet: WalletInterface | null) => {
      return wallet === null ? of(null) : wallet.watchAccount();
    }),
    filter(acc => acc !== null),
    map(acc => acc as string),
    take(1)
  );
  return firstValueFrom(res);
};

/**
 * 用户已经连接后返回用户账户信息
 */
export const userAccountInfo = async (): Promise<IAccount> => {
  const res = walletManager.watchWalletInstance().pipe(
    switchMap((wallet: WalletInterface | null) => {
      return wallet === null ? NEVER : combineLatest([wallet.watchAccount(), wallet.watchNetwork()]);
    }),
    switchMap(([account, network]: [string, EthNetwork]) => {
      //console.log("account or network", account, network);
      return contractAccessor.getUserSelfWalletBalance(account).pipe(
        map((balances: CoinBalance[]) => {
          return {
            network: network,
            address: account,
            USDBalance:
              balances && balances.length
                ? balances.reduce((total, { coin, balance }) => {
                    // @ts-ignore
                    total[coin] = Number(toEthers(balance, 4, coin));
                    return total;
                  }, {})
                : {},
          };
        })
      );
    }),
    take(1)
  );
  return firstValueFrom(res);
};

/**
 * 获取当前network与account new - 4.18
 *
 * @param old - 如果
 *  1>填入之前获得的network和account，则会比较最新的network与account，network或者account发生了改变，才会返回，否则一直阻塞。
 *  2>保留为空，则获取到当前network和account之后就会返回。
 */
export const getNetworkAndAccount = async (old?: {
  network: EthNetwork;
  account: string;
}): Promise<{ network: EthNetwork; account: string }> => {
  const res = walletManager.watchWalletInstance().pipe(
    filter(wallet => wallet !== null),
    map(wallet => wallet as WalletInterface),
    switchMap((wallet: WalletInterface) => {
      const net$ = wallet.watchNetwork();
      const acc$ = wallet.watchAccount();
      return combineLatest([net$, acc$]).pipe(
        map(([network, account]: [EthNetwork, string]) => {
          return {
            network,
            account,
          };
        })
      );
    }),
    filter(newInfo => {
      if (old) {
        return old.network !== newInfo.network || old.account !== newInfo.account;
      } else {
        return true;
      }
    }),
    take(1)
  );
  return firstValueFrom(res);
};

/**
 * 切换网络
 * @param id - chain id
 */
export const switchNetwork = async (id: EthNetwork): Promise<boolean> => {
  const res = walletManager.watchWalletInstance().pipe(
    switchMap(wallet => {
      return wallet === null ? of(false) : wallet.switchNetwork(id);
    }),
    take(1)
  );
  return firstValueFrom(res);
};

// 获取此刻用户账户地址
export const getCurUserAccount = function (): string | null {
  const wallet: WalletInterface | null = walletManager.getCurWalletInstance();
  if (wallet === null) {
    return null;
  }

  return wallet.getAccount();
};

// 获取此刻的网络类型
export const getCurNetwork = function (): EthNetwork | null {
  const wallet: WalletInterface | null = walletManager.getCurWalletInstance();
  if (wallet === null) {
    return null;
  }

  return wallet.getNetwork();
};
