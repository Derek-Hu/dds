import { ABI, ContractParam, ContractProxy, UserAccountInfo } from '../wallet/contract-interface';
import { BehaviorSubject, from, Observable, of, interval, EMPTY } from 'rxjs';
import * as ethers from 'ethers';
import { catchError, filter, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import { isMetaMaskInstalled } from './metamask';
import {
  TradeDAIContractAddress,
  DataRefreshInterval,
  DefaultNetwork,
  Wallet,
  TradeUSDTContractAddress,
  TradeUSDCContractAddress,
  ERC20DAIAddress,
  ETH_WEIGHT,
  CoinWeight,
} from '../constant';
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

abstract class BaseTradeContractAccessor implements ContractProxy {
  public transferable: boolean = false; // 是否可以发起写入操作

  protected contractMap: Map<IUSDCoins, ethers.Contract>;
  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {
    this.contractMap = this.getContractMap();
  }

  public getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => contract.functions.getPriceByETHDAI()),
      map((num: BigNumber[]) => num[0])
    );
  }

  public watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getPriceByETHDAI(coin);
      })
    );
  }

  public getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => contract.functions.userAccount(address)),
      map((num: BigNumber[]) => ({ deposit: num[0], available: num[1] })),
      catchError((err) => of({ deposit: BigNumber.from(0), available: BigNumber.from(0) }))
    );
  }

  public watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getUserAccount(address, coin);
      })
    );
  }

  public depositToken(count: number, coin: IUSDCoins): Observable<boolean> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const daiContract = this.getERC20DAIContract();
        const countNum: BigNumber = BigNumber.from(count).mul(ETH_WEIGHT);

        if (!daiContract) {
          return of(false);
        }

        return from(daiContract.approve(TradeDAIContractAddress, countNum.toString())).pipe(
          switchMap((rs: any) => from(rs.wait())),
          switchMap(() => {
            return from(contract.deposit(countNum));
          }),
          switchMap((rs: any) => from(rs.wait())),
          tap(() => console.log('d true')),
          mapTo(true),
          catchError((err) => of(false))
        );
      })
    );
  }

  public withdrawToken(count: number, coin: IUSDCoins): Observable<any> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const amount: BigNumber = BigNumber.from(count).mul(CoinWeight.get(coin) as string);
        return from(contract.withdraw(amount));
      }),
      switchMap((rs: any) => from(rs.wait())),
      mapTo(true),
      catchError((err) => of(false))
    );
  }

  public createContract(param: ContractParam): Observable<boolean> {
    return of(false);
  }

  //
  protected getContract(coin: IUSDCoins): Observable<ethers.Contract> {
    return of(this.contractMap.get(coin)).pipe(filter(Boolean)) as Observable<ethers.Contract>;
  }

  protected getERC20DAIContract(): ethers.Contract {
    return new ethers.Contract(ERC20DAIAddress, erc20, this.getSigner());
  }

  protected abstract getContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getProvider(): ethers.providers.BaseProvider;

  protected abstract getSigner(): ethers.Signer | undefined;
}

/**
 * 当没有metamask时，默认的网络连接
 */
class DefaultContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = false;

  protected getContractMap(): Map<IUSDCoins, ethers.Contract> {
    return new Map<IUSDCoins, ethers.Contract>();
  }

  protected getProvider(): ethers.providers.EtherscanProvider {
    return new ethers.providers.EtherscanProvider(DefaultNetwork);
  }

  protected getSigner(): undefined {
    return undefined;
  }

  public getUSDContract(): null {
    return null;
  }
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = true;

  protected getContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider().getSigner();

    const daiContract = new ethers.Contract(TradeDAIContractAddress, ABI, signer);
    rsMap.set('DAI', daiContract);

    if (TradeUSDTContractAddress) {
      const usdtContract = new ethers.Contract(TradeUSDTContractAddress, ABI, signer);
      rsMap.set('USDT', usdtContract);
    }

    if (TradeUSDCContractAddress) {
      const usdcContract = new ethers.Contract(TradeUSDCContractAddress, ABI, signer);
      rsMap.set('USDC', usdcContract);
    }
    return rsMap;
  }

  protected getProvider(): ethers.providers.Web3Provider {
    return new ethers.providers.Web3Provider(window.ethereum, 'any');
  }

  protected getSigner(): ethers.Signer {
    return this.getProvider().getSigner();
  }
}

/**
 * 合约访问工具
 */
export class ContractAccessor implements ContractProxy {
  private readonly chainData: ChainDataState = chainDataState;
  private readonly defaultAccessor = new DefaultContractAccessor();

  private readonly metamaskAccessor = new MetamaskContractAccessor();

  private readonly accessor: BehaviorSubject<BaseTradeContractAccessor> = new BehaviorSubject<BaseTradeContractAccessor>(
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

  public watchContractAccessor(): Observable<BaseTradeContractAccessor> {
    return this.accessor;
  }

  private changeAccessor(accessor: BaseTradeContractAccessor) {
    if (this.accessor.getValue() === accessor) {
      return;
    }
    this.accessor.next(accessor);
  }

  public getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.accessor.getValue().getPriceByETHDAI(coin);
  }

  public watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.watchPriceByETHDAI(coin);
      })
    );
  }

  public getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.accessor.getValue().getUserAccount(address, coin);
  }

  public watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.accessor.pipe(
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.watchUserAccount(address, coin);
      })
    );
  }

  public depositToken(count: number, coin: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      filter((accessor: BaseTradeContractAccessor) => accessor.transferable),
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.depositToken(count, coin);
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public withdrawToken(count: number, coin: IUSDCoins): Observable<any> {
    return this.accessor.pipe(
      filter((accessor: BaseTradeContractAccessor) => accessor.transferable),
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.withdrawToken(count, coin);
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public createContract(param: ContractParam): Observable<any> {
    return of();
  }
}

export const contractAccessor = new ContractAccessor();
