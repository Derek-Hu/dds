import { ABI, ContractParam, ContractProxy, UserAccountInfo } from '../wallet/contract-interface';
import { BehaviorSubject, from, Observable, of, interval } from 'rxjs';
import * as ethers from 'ethers';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import { isMetaMaskInstalled } from './metamask';
import { ContractAddress, DAIAddress, DataRefreshInterval, DefaultNetwork, Wallet } from '../constant';
import { chainDataState, ChainDataState } from '../wallet/chain-connect-state';
import { walletManager } from '../wallet/wallet-manager';

declare const window: Window & { ethereum: any };

const erc20 = [
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

abstract class BaseContractAccessor implements ContractProxy {
  public transferable: boolean = false; // 是否可以发起写入操作

  protected contract: ethers.Contract | null = null;
  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {
    this.contract = this.getContract();
  }

  public getPriceByETHDAI(): Observable<BigNumber> {
    if (this.contract) {
      return from(this.contract.functions.getPriceByETHDAI()).pipe(
        map((num: BigNumber[]) => {
          return num[0];
        })
      );
    } else {
      return of(BigNumber.from(0));
    }
  }

  public watchPriceByETHDAI(): Observable<BigNumber> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getPriceByETHDAI();
      })
    );
  }

  public getUserAccount(address: string): Observable<UserAccountInfo> {
    if (this.contract) {
      return from(this.contract.functions.userAccount(address)).pipe(
        map((num: BigNumber[]) => {
          return { deposit: num[0], available: num[1] };
        }),
        catchError((err) => {
          return of({ deposit: BigNumber.from(0), available: BigNumber.from(0) });
        })
      );
    } else {
      return of({ deposit: BigNumber.from(0), available: BigNumber.from(0) });
    }
  }

  public watchUserAccount(address: string): Observable<UserAccountInfo> {
    if (this.contract) {
      return this.timer.pipe(
        switchMap(() => {
          return this.getUserAccount(address);
        })
      );
    } else {
      return of({ deposit: BigNumber.from(0), available: BigNumber.from(0) });
    }
  }

  public depositToken(count: string): Observable<any> {
    if (this.contract) {
      const dai: ethers.Contract | null = this.getDaiContract(this.getProvider());

      if (dai === null) {
        return of(false);
      }

      return from(dai.approve(ContractAddress, BigNumber.from(count))).pipe(
        switchMap((rs: any) => {
          return from(rs.wait());
        }),
        switchMap(() => {
          const countNum: BigNumber = BigNumber.from(count);
          if (this.contract === null) {
            return of(false);
          }
          return from(this.contract.deposit(countNum)).pipe(
            switchMap((rs: any) => {
              return from(rs.wait());
            })
          );
        })
      );
    } else {
      return of(false);
    }
  }

  public withdrawToken(count: string): Observable<any> {
    if (!this.contract) {
      return of(false);
    }

    const amount: BigNumber = BigNumber.from(count);
    return from(this.contract.functions.withdraw(amount)).pipe(
      tap((rs) => {
        console.log('rs', rs);
      }),
      switchMap((rs: { wait: Function }) => {
        return from(rs.wait());
      })
    );
  }

  public createContract(param: ContractParam): Observable<any> {
    if (!this.contract) {
      return of(false);
    }

    return from(this.contract.functions.creatContract(param.exchangeType, param.number, param.contractType)).pipe();
  }

  //
  protected abstract getContract(): ethers.Contract | null;

  protected abstract getProvider(): ethers.providers.BaseProvider;

  public abstract getDaiContract(provider: ethers.providers.BaseProvider): ethers.Contract | null;
}

/**
 * 当没有metamask时，默认的网络连接
 */
class DefaultContractAccessor extends BaseContractAccessor {
  public readonly transferable = false;

  protected getContract(): ethers.Contract | null {
    let contract = new ethers.Contract(ContractAddress, ABI, this.getProvider());
    return contract;
  }

  protected getProvider(): ethers.providers.EtherscanProvider {
    return new ethers.providers.EtherscanProvider(DefaultNetwork);
  }

  public getDaiContract(): ethers.Contract | null {
    return null;
  }
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseContractAccessor {
  public readonly transferable = true;

  protected getContract(): ethers.Contract | null {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    return new ethers.Contract(ContractAddress, ABI, this.getProvider().getSigner());
  }

  protected getProvider(): ethers.providers.Web3Provider {
    return new ethers.providers.Web3Provider(window.ethereum, 'any');
  }

  public getDaiContract(provider: ethers.providers.Web3Provider): ethers.Contract | null {
    return new ethers.Contract(DAIAddress, erc20, provider.getSigner());
  }
}

/**
 * 合约访问工具
 */
export class ContractAccessor implements ContractProxy {
  private readonly chainData: ChainDataState = chainDataState;
  private readonly defaultAccessor = new DefaultContractAccessor();
  private readonly metamaskAccessor = new MetamaskContractAccessor();

  private readonly accessor: BehaviorSubject<BaseContractAccessor> = new BehaviorSubject<BaseContractAccessor>(
    new DefaultContractAccessor()
  );

  constructor() {
    walletManager.watchWalletInstance();

    this.chainData.watchWallet().subscribe((wallet: Wallet | null) => {
      if (wallet === null) {
        this.changeAccessor(this.defaultAccessor);
      } else if (wallet === Wallet.Metamask) {
        if (isMetaMaskInstalled()) {
          this.changeAccessor(this.metamaskAccessor);
        } else {
          this.changeAccessor(this.defaultAccessor);
        }
      } else {
        // TODO add other wallet
      }
    });
  }

  public watchContractAccessor(): Observable<BaseContractAccessor> {
    return this.accessor;
  }

  private changeAccessor(accessor: BaseContractAccessor) {
    if (this.accessor.getValue() === accessor) {
      return;
    }
    this.accessor.next(accessor);
  }

  public getPriceByETHDAI(): Observable<BigNumber> {
    return this.accessor.getValue().getPriceByETHDAI();
  }

  public watchPriceByETHDAI(): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor: BaseContractAccessor) => {
        return accessor.watchPriceByETHDAI();
      })
    );
  }

  public getUserAccount(address: string): Observable<UserAccountInfo> {
    return this.accessor.getValue().getUserAccount(address);
  }

  public watchUserAccount(address: string): Observable<UserAccountInfo> {
    return this.accessor.pipe(
      switchMap((accessor: BaseContractAccessor) => {
        return accessor.watchUserAccount(address);
      })
    );
  }

  public depositToken(count: string): Observable<any> {
    return this.accessor.pipe(
      filter((accessor: BaseContractAccessor) => accessor.transferable),
      switchMap((accessor: BaseContractAccessor) => {
        return accessor.depositToken(count);
      }),
      catchError((err) => {
        console.log('err=', err);
        return of(false);
      })
    );
  }

  public withdrawToken(count: string): Observable<any> {
    return this.accessor.pipe(
      filter((accessor: BaseContractAccessor) => accessor.transferable),
      switchMap((accessor: BaseContractAccessor) => {
        return accessor.withdrawToken(count);
      }),
      catchError((err) => {
        console.log('err = ', err);
        return of(false);
      })
    );
  }

  public createContract(param: ContractParam): Observable<any> {
    return of();
  }
}

export const contractAccessor = new ContractAccessor();
