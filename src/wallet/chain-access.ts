import {
  ABI,
  CoinBalance,
  CoinShare,
  ContractProxy,
  ERC20,
  LiquidatorABI,
  Pl1ABI,
  Pl2ABI,
  RewardsABI,
  SwapBurnABI,
  UserAccountInfo,
} from '../wallet/contract-interface';
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
  Lp1DAIContractAddress,
  Lp2DAIContractAddress,
  MiningRewardContractAddress,
  DefaultNetwork,
  LiquidatorContractAddress,
  SwapBurnContractAddress,
  ERC20USDTAddress,
  ERC20USDCAddress,
  SystemFundingAccount,
  ERC20DDSAddress,
} from '../constant';
import { walletManager } from '../wallet/wallet-manager';
import { WalletInterface } from './wallet-interface';
import { toBigNumber, toEthers, tokenBigNumber } from '../util/ethers';
import { isMetaMaskInstalled } from './metamask';

declare const window: Window & { ethereum: any };

abstract class BaseTradeContractAccessor implements ContractProxy {
  public transferable: boolean = false; // 是否可以发起写入操作

  protected contractMap: Map<IUSDCoins, ethers.Contract>;
  protected pubContractMap: Map<IUSDCoins, ethers.Contract>;
  protected priContractMap: Map<IUSDCoins, ethers.Contract>;

  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {
    this.contractMap = this.getTradeContractMap();
    this.pubContractMap = this.getPubPoolContractMap();
    this.priContractMap = this.getPrivatePoolContractMap();
  }

  public getUserSelfWalletBalance(address: string): Observable<CoinBalance[]> {
    const dds$: Observable<CoinBalance> = from(this.getERC20DDSContract().functions.balanceOf(address)).pipe(
      map((rs) => {
        return { coin: 'DDS', balance: rs[0] };
      })
    );

    const dai$: Observable<CoinBalance> = from(this.getERC20DAIContract().functions.balanceOf(address)).pipe(
      map((rs) => {
        return { coin: 'DAI', balance: rs[0] };
      })
    );

    return zip(dds$, dai$);
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
      }),
      catchError((err) => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount = toBigNumber(tokenAmount, 18);
        return contract.functions.getReTokenAmountByToken(bigAmount);
      }),
      map((rs) => {
        return rs.retokenAmount;
      })
    );
  }

  public provideToPubPool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount = toBigNumber(coinAmount, 18);
        const daiContract = this.getERC20DAIContract(); // 当前只用DAI，后期动态获取

        if (!daiContract) {
          return of(false);
        }

        return from(daiContract.approve(Lp1DAIContractAddress, bigAmount)).pipe(
          switchMap((rs: any) => from(rs.wait())),
          switchMap((d) => {
            return contract.functions.provide(bigAmount);
          }),
          switchMap((rs: any) => from(rs.wait()))
        );
      }),
      mapTo(true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount: BigNumber = toBigNumber(reCoinAmount, 18);
        return contract.withdraw(bigAmount);
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance: Observable<BigNumber> = this.getPubPoolContract('DAI').pipe(
      switchMap((contract) => {
        return from(contract.balanceOf(address)).pipe(
          switchMap((reToken: any) => {
            return contract.getTokenAmountByreToken(reToken);
          })
        );
      }),
      map((rs: any) => {
        return rs;
      })
    );

    const usdtBalance = of(BigNumber.from(0));
    const usdcBalance = of(BigNumber.from(0));

    return zip(daiBalance, usdtBalance, usdcBalance).pipe(
      map((balances: BigNumber[]) => {
        const rs = new Map();
        rs.set('DAI', balances[0]);
        rs.set('USDT', balances[1]);
        rs.set('USDC', balances[2]);
        return rs;
      })
    );
  }

  public pubPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance: Observable<BigNumber> = this.getPubPoolContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.getLPAmountInfo();
      }),
      map((rs: any) => {
        return rs.availabe as BigNumber;
      })
    );

    const usdtBalance = of(BigNumber.from(0));
    const usdcBalance = of(BigNumber.from(0));

    return zip(daiBalance, usdtBalance, usdcBalance).pipe(
      map((balances: BigNumber[]) => {
        const rs = new Map();
        rs.set('DAI', balances[0]);
        rs.set('USDT', balances[1]);
        rs.set('USDC', balances[2]);

        console.log(' rs', rs);
        return rs;
      })
    );
  }

  public getReTokenBalance(address: string): Observable<CoinBalance[]> {
    const daiBalance: Observable<BigNumber> = this.getPubPoolContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.getUserReToeknInfo(address);
      }),
      map((rs: any) => {
        return rs.selfReToken as BigNumber;
      })
    );

    const usdtBalance = of(BigNumber.from(0));
    const usdcBalance = of(BigNumber.from(0));

    return zip(daiBalance, usdtBalance, usdcBalance).pipe(
      map((balances: BigNumber[]) => {
        return [
          { coin: 'reDAI', balance: balances[0] },
          { coin: 'reUSDT', balance: balances[1] },
          { coin: 'reUSDC', balance: balances[2] },
        ];
      })
    );
  }

  //

  public provideToPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPriPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount = toBigNumber(coinAmount, 18);
        const daiContract = this.getERC20DAIContract(); // 当前只用DAI，后期动态获取

        if (!daiContract) {
          return of(false);
        }

        return from(daiContract.approve(Lp2DAIContractAddress, bigAmount)).pipe(
          switchMap((rs: any) => from(rs.wait())),
          switchMap((d) => {
            return contract.functions.provide(bigAmount);
          }),
          switchMap((rs: any) => from(rs.wait()))
        );
      }),
      mapTo(true),
      catchError((err) => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPriPoolContract(coin).pipe(
      switchMap((contract) => {
        const bigAmount: BigNumber = toBigNumber(coinAmount, 18);
        return contract.withdraw(bigAmount);
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance = this.getPriPoolContract('DAI').pipe(
      switchMap((contract) => {
        return contract.functions.lpAccount(address);
      }),
      map((rs: BigNumber[]) => {
        console.log('private balance rs is', rs);
        return rs[0];
      })
    );

    const usdtBalance = of(BigNumber.from(0));
    const usdcBalance = of(BigNumber.from(0));

    return zip(daiBalance, usdtBalance, usdcBalance).pipe(
      map((balances: BigNumber[]) => {
        const rs = new Map();
        rs.set('DAI', balances[0]);
        rs.set('USDT', balances[1]);
        rs.set('USDC', balances[2]);
        return rs;
      })
    );
  }

  public priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance: Observable<BigNumber> = this.getPriPoolContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.getLPAmountInfo();
      }),
      map((rs: any) => {
        return rs.availabe as BigNumber;
      })
    );

    const usdtBalance = of(BigNumber.from(0));
    const usdcBalance = of(BigNumber.from(0));

    return zip(daiBalance, usdtBalance, usdcBalance).pipe(
      map((balances: BigNumber[]) => {
        const rs = new Map();
        rs.set('DAI', balances[0]);
        rs.set('USDT', balances[1]);
        rs.set('USDC', balances[2]);
        return rs;
      })
    );
  }

  //

  public getLiquidityMiningReward(address: string): Observable<BigNumber> {
    return from(this.getMiningRewardContract().functions.queryRewardsForLP1(address)).pipe(
      map((rs) => {
        return rs;
      })
    );
  }

  public getLiquidityMiningShare(address: string): Observable<CoinShare[]> {
    return from(this.getMiningRewardContract().functions.queryStakeShareInfoForLP1(address)).pipe(
      map((rs: BigNumber[]) => {
        return [
          { coin: 'DAI', value: rs[0], total: rs[3] },
          { coin: 'USDT', value: rs[1], total: rs[4] },
          { coin: 'USDC', value: rs[2], total: rs[5] },
        ];
      })
    );
  }

  public getActiveLiquidityRewards(address: string): Observable<BigNumber> {
    return from(this.getMiningRewardContract().functions.queryRewardsForLP2(address)).pipe(
      map((rs: BigNumber) => {
        return rs;
      }),
      catchError((err) => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public claimRewardsForLP2(): Observable<boolean> {
    return from(this.getMiningRewardContract().functions.claimRewardsForLP2()).pipe(
      switchMap((rs) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError((err) => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public getSystemFundingBalance(): Observable<CoinBalance[]> {
    const dai$ = from(this.getERC20DAIContract().functions.balanceOf(SystemFundingAccount)).pipe(
      map((rs: BigNumber[]) => {
        return rs[0];
      })
    );

    const usdt$ = from(this.getERC20USDTContract().functions.balanceOf(SystemFundingAccount)).pipe(
      map((rs: BigNumber[]) => {
        return rs[0];
      })
    );

    const usdc$ = from(this.getERC20USDCContract().functions.balanceOf(SystemFundingAccount)).pipe(
      map((rs: BigNumber[]) => {
        return rs[0];
      })
    );

    return zip(dai$, usdt$, usdc$).pipe(
      map(([dai, usdt, usdc]) => {
        return [
          {
            coin: 'DAI',
            balance: dai,
          },
          {
            coin: 'USDT',
            balance: usdt,
          },
          {
            coin: 'USDC',
            balance: usdc,
          },
        ] as CoinBalance[];
      })
    );
  }

  public getLiquiditorRewards(address: string): Observable<CoinBalance[]> {
    return from(this.getLiquidatorContract().functions.getFeeBackByLiquidor(address)).pipe(
      map((rs: BigNumber[]) => {
        return [
          {
            coin: 'DAI',
            balance: rs[0],
          },
          {
            coin: 'USDT',
            balance: rs[1],
          },
          {
            coin: 'USDC',
            balance: rs[2],
          },
          {
            coin: 'DDS',
            balance: rs[3],
          },
        ] as CoinBalance[];
      })
    );
  }

  //

  public getSwapBurnInfo(): Observable<CoinBalance[]> {
    return from(this.getSwapBurnContract().functions.getBuyBackInfo()).pipe(
      map((rs: BigNumber[]) => {
        return [
          {
            coin: 'DDS',
            balance: rs[0],
          },
          {
            coin: 'DAI',
            balance: rs[1],
          },
          {
            coin: 'USDT',
            balance: rs[2],
          },
          {
            coin: 'USDC',
            balance: rs[3],
          },
        ] as CoinBalance[];
      })
    );
  }

  public doSwap(coin: IUSDCoins, ddsAmount: number): Observable<boolean> {
    const coinType: 1 | 2 | 3 = coin === 'DAI' ? 1 : coin === 'USDT' ? 2 : 3;
    const tokenType: BigNumber = BigNumber.from(coinType);
    const tokenAmount: BigNumber = tokenBigNumber(ddsAmount, 'DDS');

    return from(this.getSwapBurnContract().functions.swap(tokenType, tokenAmount)).pipe(
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError((err) => {
        console.warn('error', err);
        return of(false);
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
    return new ethers.Contract(ERC20DAIAddress, ERC20, this.getSigner());
  }

  protected getERC20USDTContract(): ethers.Contract {
    return new ethers.Contract(ERC20USDTAddress, ERC20, this.getSigner());
  }

  protected getERC20USDCContract(): ethers.Contract {
    return new ethers.Contract(ERC20USDCAddress, ERC20, this.getSigner());
  }

  protected getERC20DDSContract(): ethers.Contract {
    return new ethers.Contract(ERC20DDSAddress, ERC20, this.getSigner());
  }

  protected abstract getTradeContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getPubPoolContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getMiningRewardContract(): ethers.Contract;

  protected abstract getSwapBurnContract(): ethers.Contract;

  protected abstract getLiquidatorContract(): ethers.Contract;

  protected abstract getPrivatePoolContractMap(): Map<IUSDCoins, ethers.Contract>;

  protected abstract getProvider(): ethers.providers.BaseProvider;

  protected abstract getSigner(): ethers.Signer | undefined;
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = true;

  protected getMiningRewardContract(): ethers.Contract {
    const signer = this.getProvider().getSigner();

    return new ethers.Contract(MiningRewardContractAddress, RewardsABI, signer);
  }

  protected getLiquidatorContract(): ethers.Contract {
    return new ethers.Contract(LiquidatorContractAddress, LiquidatorABI, this.getSigner());
  }

  protected getSwapBurnContract(): ethers.Contract {
    return new ethers.Contract(SwapBurnContractAddress, SwapBurnABI, this.getSigner());
  }

  protected getPrivatePoolContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider().getSigner();

    const daiCon = new ethers.Contract(Lp2DAIContractAddress, Pl2ABI, signer);
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

  protected getTradeContractMap(): Map<IUSDCoins, ethers.Contract> {
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

// 默认访问路径，只能读取
class DefaultContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = false;

  protected getMiningRewardContract(): ethers.Contract {
    return new ethers.Contract(MiningRewardContractAddress, RewardsABI, this.getProvider());
  }

  protected getSwapBurnContract(): ethers.Contract {
    return new ethers.Contract(SwapBurnContractAddress, SwapBurnABI, this.getProvider());
  }

  protected getLiquidatorContract(): ethers.Contract {
    return new ethers.Contract(LiquidatorContractAddress, LiquidatorABI, this.getProvider());
  }

  protected getPrivatePoolContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider();

    const daiCon = new ethers.Contract(Lp2DAIContractAddress, Pl2ABI, signer);
    rsMap.set('DAI', daiCon);

    return rsMap;
  }

  protected getProvider(): ethers.providers.BaseProvider {
    return ethers.getDefaultProvider(DefaultNetwork);
  }

  protected getPubPoolContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider();

    const daiCon = new ethers.Contract(Lp1DAIContractAddress, Pl1ABI, signer);
    rsMap.set('DAI', daiCon);

    return rsMap;
  }

  protected getSigner(): ethers.Signer | undefined {
    return undefined;
  }

  protected getTradeContractMap(): Map<IUSDCoins, ethers.Contract> {
    const rsMap = new Map<IUSDCoins, ethers.Contract>();
    const signer = this.getProvider();

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
}

/**
 * 合约访问工具
 */
export class ContractAccessor implements ContractProxy {
  //
  private readonly metamaskAccessor: MetamaskContractAccessor | null;
  private readonly defaultAccessor = new DefaultContractAccessor();

  constructor() {
    if (isMetaMaskInstalled()) {
      this.metamaskAccessor = new MetamaskContractAccessor();
    } else {
      this.metamaskAccessor = null;
    }

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

  public get anyAccessor(): Observable<BaseTradeContractAccessor> {
    return this.curAccessor.pipe(
      map(
        (a: BaseTradeContractAccessor | null): BaseTradeContractAccessor => {
          return a === null ? this.defaultAccessor : a;
        }
      ),
      take(1)
    );
  }

  public watchContractAccessor(): Observable<BaseTradeContractAccessor> {
    return this.curAccessor.pipe(filter((a) => a !== null)) as Observable<BaseTradeContractAccessor>;
  }

  public getUserSelfWalletBalance(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getUserSelfWalletBalance(address);
      })
    );
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

  //

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

  public getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getPubPoolWithdrawReTokenFromToken(coin, tokenAmount);
      })
    );
  }

  public provideToPubPool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.provideToPubPool(coin, coinAmount);
      })
    );
  }

  public withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.withdrawFromPubPool(coin, reCoinAmount);
      })
    );
  }

  public pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.pubPoolBalanceOf(address);
      })
    );
  }

  public pubPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.pubPoolBalanceWhole();
      })
    );
  }

  public getReTokenBalance(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getReTokenBalance(address);
      })
    );
  }

  //

  public provideToPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.provideToPrivatePool(coin, coinAmount);
      })
    );
  }

  public withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.withdrawFromPrivatePool(coin, coinAmount);
      })
    );
  }

  public priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.priPoolBalanceOf(address);
      })
    );
  }

  public priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.priPoolBalanceWhole();
      })
    );
  }

  public getSystemFundingBalance(): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getSystemFundingBalance();
      })
    );
  }

  public getLiquiditorRewards(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getLiquiditorRewards(address);
      })
    );
  }

  //

  public getLiquidityMiningReward(address: string): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getLiquidityMiningReward(address);
      })
    );
  }

  public getLiquidityMiningShare(address: string): Observable<CoinShare[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getLiquidityMiningShare(address);
      })
    );
  }

  public getActiveLiquidityRewards(address: string): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getActiveLiquidityRewards(address);
      })
    );
  }

  public claimRewardsForLP2(): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.claimRewardsForLP2();
      })
    );
  }

  public getSwapBurnInfo(): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.getSwapBurnInfo();
      })
    );
  }

  public doSwap(coin: IUSDCoins, ddsAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap((accessor) => {
        return accessor.doSwap(coin, ddsAmount);
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

contractAccessor.getSystemFundingBalance().subscribe();
