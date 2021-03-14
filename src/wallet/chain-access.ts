import { ABI, ContractProxy, Pl1ABI, Pl2ABI, UserAccountInfo } from '../wallet/contract-interface';
import { BehaviorSubject, from, Observable, of, interval, EMPTY, zip, merge } from 'rxjs';
import * as ethers from 'ethers';
import { catchError, filter, map, mapTo, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import {
  TradeDAIContractAddress,
  DataRefreshInterval,
  Wallet,
  TradeUSDTContractAddress,
  TradeUSDCContractAddress,
  ERC20DAIAddress,
  ETH_WEIGHT,
  CoinWeight,
  Lp1DAIContractAddress,
} from '../constant';
import { walletManager } from '../wallet/wallet-manager';
import { WalletInterface } from './wallet-interface';
import { toBigNumber, toEthers } from '../util/ethers';

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
  protected pubContractMap: Map<IUSDCoins, ethers.Contract>;
  protected priContractMap: Map<IUSDCoins, ethers.Contract>;

  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {
    this.contractMap = this.getContractMap();
    this.pubContractMap = this.getPubPoolContractMap();
    this.priContractMap = this.getPrivatePoolContractMap();
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

  public getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangePair, maxUSDAmount: number): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        // 用户输入数字转成接口精度
        const usdAmount: BigNumber = BigNumber.from(1207000000).mul(ETH_WEIGHT);
        return contract.functions.getMaxOpenAmount(exchange, usdAmount);
      }),
      map((num: BigNumber[]) => {
        return num[0];
      }),
      catchError((err) => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public watchMaxOpenAmount(coin: IUSDCoins, exchange: IExchangePair): Observable<BigNumber> {
    return this.timer.pipe(
      switchMap(() => {
        return walletManager.watchWalletInstance().pipe(
          filter((walletIns: WalletInterface | null) => walletIns !== null),
          switchMap((walletIns: WalletInterface | null) => {
            return (walletIns as WalletInterface).watchAccount();
          }),
          filter((account: string | null) => account !== null)
        );
      }),
      switchMap((userAddress: string | null) => {
        return this.watchUserAccount(userAddress as string, coin);
      }),
      switchMap((info: UserAccountInfo) => {
        const maxAmount: number = Number(toEthers(info.available, 0));
        return this.getMaxOpenAmount(coin, exchange, maxAmount);
      })
    );
  }

  public depositToken(count: number, coin: IUSDCoins): Observable<boolean> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const daiContract = this.getERC20DAIContract();
        const countNum: BigNumber = toBigNumber(count, 18);

        if (!daiContract) {
          return of(false);
        }

        return from(daiContract.approve(TradeDAIContractAddress, countNum.toString())).pipe(
          switchMap((rs: any) => from(rs.wait())),
          switchMap(() => {
            return from(contract.deposit(countNum));
          }),
          switchMap((rs: any) => from(rs.wait())),
          mapTo(true),
          catchError((err) => of(false))
        );
      })
    );
  }

  public withdrawToken(count: number, coin: IUSDCoins): Observable<any> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const amount: BigNumber = toBigNumber(count, 18);
        return from(contract.withdraw(amount));
      }),
      switchMap((rs: any) => from(rs.wait())),
      mapTo(true),
      catchError((err) => of(false))
    );
  }

  public createContract(coin: IUSDCoins, orderType: ITradeType, amount: number): Observable<boolean> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const bigAmount = toBigNumber(amount, 18);
        const contractType = orderType === 'long' ? 1 : 2;
        return contract.functions.creatContract('ETHDAI', bigAmount, contractType);
      }),
      switchMap((rs: any) => {
        return rs.wait();
      }),
      mapTo(true),
      catchError((err) => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public closeContract(order: ITradeRecord, curPrice: number): Observable<boolean> {
    return this.getContract(order.costCoin).pipe(
      switchMap((contract: ethers.Contract) => {
        const id = BigNumber.from(order.id);
        const price = toBigNumber(curPrice, 18);
        return contract.functions.closeContract(id, price);
      }),
      mapTo(true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public getUserOrders(
    address: string,
    curPrice: BigNumber,
    page: number,
    pageSize: number
  ): Observable<ITradeRecord[]> {
    return this.getContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.getUserOrderID(address);
      }),
      switchMap((ids: BigNumber[][]) => {
        const orderIds: BigNumber[] = ids[0];
        if (orderIds.length === 0) {
          return of([]);
        }

        let begin = (page - 1) * pageSize;
        if (begin >= orderIds.length) {
          return of([]);
        }

        let end = page * pageSize;
        if (end > orderIds.length) {
          end = orderIds.length;
        }

        const pageOrderIds: BigNumber[] = orderIds.slice(begin, end);
        const obs: Observable<any>[] = pageOrderIds.map((id: BigNumber) =>
          this.getContract('DAI').pipe(
            switchMap((contract: ethers.Contract) => {
              return from(contract.functions.getOrderInfo(id)).pipe(map((info) => ({ id, info })));
            }),
            map((order: { id: BigNumber; info: any }) => {
              const stateSign: '1' | '2' = order.info.state.toString();
              const diffPrice: BigNumber =
                stateSign === '1'
                  ? curPrice.sub(order.info.openPrice)
                  : order.info.closePrice.sub(order.info.openPrice);
              const plPercent: number =
                Number(toEthers(diffPrice.mul('100'), 0)) / Number(toEthers(order.info.openPrice, 0));
              const pl: number = Number(toEthers(diffPrice, 0)) * Number(toEthers(order.info.number, 0));
              return {
                id: order.id.toString(),
                time: Number(order.info.startTime.toString()),
                type: order.info.contractType.toString() === '1' ? 'long' : 'short',
                amount: Number(toEthers(order.info.number, 4)),
                price: Number(toEthers(order.info.openPrice, 4)),
                costCoin: 'DAI',
                exchange: order.info.exchangeType,
                cost: Number(toEthers((order.info.lockFee as BigNumber).add(order.info.newLockFee as BigNumber), 4)),
                status: stateSign === '1' ? 'ACTIVE' : 'CLOSED',
                fee: Number(toEthers(order.info.exFee, 4)),
                pl: {
                  val: Math.round(pl * 10000) / 10000,
                  percentage: Math.round(plPercent * 100) / 100,
                },
              } as ITradeRecord;
            })
          )
        );

        return zip(...obs).pipe(take(1));
      }),
      map((orderInfo: any[]) => {
        return orderInfo;
      })
    );
  }

  public getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangePair, ethAmount: number): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        return this.getPriceByETHDAI(coin).pipe(
          switchMap((price: BigNumber) => {
            const amount: BigNumber = toBigNumber(ethAmount, 18);
            return contract.functions.getLockedAmount(amount, price, exchange, '2');
          })
        );
      }),
      map((rs: any) => {
        return rs.marginFee;
      })
    );
  }

  //
  public getPubPoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.getLPAmountInfo();
      }),
      map((rs: any) => {
        const total: number = Number(toEthers(rs.deposit, 4));
        const available: number = Number(toEthers(rs.availabe, 4));
        return {
          value: available,
          total,
        };
      })
    );
  }

  public getPrivatePoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.getPriPoolContract(coin).pipe(
      switchMap((contract) => {
        return contract.functions.getLPAmountInfo();
      }),
      map((rs: any) => {
        const total: number = Number(toEthers(rs.deposit, 4));
        const available: number = Number(toEthers(rs.availabe, 4));
        return {
          value: available,
          total,
        };
      })
    );
  }

  public getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount = toBigNumber(tokenAmount, 18);
        return contract.functions.getMintReDaiAmount(bigAmount);
      }),
      map((rs) => {
        return rs.mintOtoken;
      })
    );
  }

  //
  protected getContract(coin: IUSDCoins): Observable<ethers.Contract> {
    return of(this.contractMap.get(coin)).pipe(filter(Boolean)) as Observable<ethers.Contract>;
  }

  protected getPubPoolContract(coin: IUSDCoins): Observable<ethers.Contract> {
    return of(this.pubContractMap.get(coin)).pipe(filter(Boolean)) as Observable<ethers.Contract>;
  }

  protected getPriPoolContract(coin: IUSDCoins): Observable<ethers.Contract> {
    return of(this.priContractMap.get(coin)).pipe(filter(Boolean)) as Observable<ethers.Contract>;
  }

  protected getERC20DAIContract(): ethers.Contract {
    return new ethers.Contract(ERC20DAIAddress, erc20, this.getSigner());
  }

  protected abstract getContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getPubPoolContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getPrivatePoolContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getProvider(): ethers.providers.BaseProvider;

  protected abstract getSigner(): ethers.Signer | undefined;
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = true;

  protected getPrivatePoolContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider().getSigner();

    const daiCon = new ethers.Contract(Lp1DAIContractAddress, Pl2ABI, signer);
    rsMap.set('DAI', daiCon);

    return rsMap;
  }

  protected getPubPoolContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider().getSigner();

    const daiCon = new ethers.Contract(Lp1DAIContractAddress, Pl1ABI, signer);
    rsMap.set('DAI', daiCon);

    return rsMap;
  }

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
  //
  private readonly metamaskAccessor = new MetamaskContractAccessor();

  private readonly curAccessor: BehaviorSubject<BaseTradeContractAccessor | null> = new BehaviorSubject<BaseTradeContractAccessor | null>(
    null
  );

  public get accessor(): Observable<BaseTradeContractAccessor> {
    return this.curAccessor.pipe(
      filter((a: BaseTradeContractAccessor | null) => a !== null),
      map((a) => a as BaseTradeContractAccessor),
      take(1)
    );
  }

  constructor() {
    const sub = walletManager
      .watchWalletType()
      .pipe(
        tap((wallet: Wallet | null) => {
          switch (wallet) {
            case Wallet.Metamask: {
              this.changeAccessor(this.metamaskAccessor);
              break;
            }
            default: {
              this.changeAccessor(null);
            }
          }
        })
      )
      .subscribe();
  }

  public watchContractAccessor(): Observable<BaseTradeContractAccessor> {
    return this.curAccessor.pipe(filter((a) => a !== null)) as Observable<BaseTradeContractAccessor>;
  }

  public getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getPriceByETHDAI(coin)));
  }

  public watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.watchContractAccessor().pipe(
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.watchPriceByETHDAI(coin);
      })
    );
  }

  public getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getUserAccount(address, coin)));
  }

  public watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.watchContractAccessor().pipe(
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.watchUserAccount(address, coin);
      })
    );
  }

  public getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangePair, maxUSDAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getMaxOpenAmount(coin, exchange, maxUSDAmount)));
  }

  public depositToken(count: number, coin: IUSDCoins): Observable<boolean> {
    return this.watchContractAccessor().pipe(
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
    return this.watchContractAccessor().pipe(
      filter((accessor: BaseTradeContractAccessor) => accessor.transferable),
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.withdrawToken(count, coin);
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public createContract(coin: IUSDCoins, orderType: ITradeType, amount: number): Observable<any> {
    return this.accessor.pipe(switchMap((accessor) => accessor.createContract(coin, orderType, amount)));
  }

  public closeContract(orderId: ITradeRecord, curPrice: number): Observable<boolean> {
    return this.accessor.pipe(switchMap((accessor) => accessor.closeContract(orderId, curPrice)));
  }

  public getUserOrders(address: string, curPrice: BigNumber, page: number, pageSize: number): Observable<any> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getUserOrders(address, curPrice, page, pageSize)));
  }

  public getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangePair, ethAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getFundingLockedAmount(coin, exchange, ethAmount)));
  }

  public getPubPoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getPubPoolInfo(coin)));
  }

  public getPrivatePoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.accessor.pipe(switchMap((accessor) => accessor.getPrivatePoolInfo(coin)));
  }

  public getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getPubPoolDepositReTokenFromToken(coin, tokenAmount);
      })
    );
  }

  // ------------------------------------------------------------------------------------------

  private changeAccessor(accessor: BaseTradeContractAccessor | null) {
    if (this.curAccessor.getValue() === accessor) {
      return;
    }
    this.curAccessor.next(accessor);
  }
}

export const contractAccessor = new ContractAccessor();

contractAccessor.getPrivatePoolInfo('DAI').subscribe();

contractAccessor.getPubPoolDepositReTokenFromToken('DAI', 1).subscribe();
