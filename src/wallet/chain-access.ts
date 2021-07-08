import {
  CoinBalance,
  CoinShare,
  ConfirmInfo,
  ContractProxy,
  LiquditorRewardsResult,
  PrivateLockLiquidity,
  PrivatePoolAccountInfo,
  PubPoolLockInfo,
  PubPoolRewards,
  UserAccountInfo,
} from '../wallet/contract-interface';
import { BehaviorSubject, EMPTY, from, interval, merge, NEVER, Observable, of, zip } from 'rxjs';
import * as ethers from 'ethers';
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  mapTo,
  reduce,
  retryWhen,
  startWith,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import { DataRefreshInterval, ETH_WEIGHT, MyTokenSymbol, SystemFundingAccount, Wallet } from '../constant';
import { walletManager } from '../wallet/wallet-manager';
import { WalletInterface } from './wallet-interface';
import { fromExchangePair, toEthers, toExchangePair, tokenBigNumber } from '../util/ethers';
import { isMetaMaskInstalled } from './metamask';
import { getPageListRange } from '../util/page';
import { ContractAddress, ContractAddressByNetwork } from '../constant/address';
import { getContractAddress, getContractInfo } from './contract-info';
import { bigNumMultiple } from '../util/math';
import { ReTokenMapping } from '../constant/tokens';
import { EthNetwork, SupportedNetwork } from '../constant/network';

declare const window: Window & { ethereum: any };

abstract class BaseTradeContractAccessor implements ContractProxy {
  public transferable = false; // 是否可以发起写入操作

  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {}

  // air drop coin is
  public airDropWhiteList(address: string): Observable<BigNumber> {
    return this.getAirDropContract().pipe(
      switchMap(contract => {
        console.log('whiteList', contract.address, address);
        return from(contract.whiteList(address) as Promise<BigNumber>);
      }),
      map((rs: BigNumber) => {
        return rs;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public airDropClaim(): Observable<boolean> {
    return this.getAirDropContract().pipe(
      switchMap(contract => {
        return from(contract.claim());
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public claimTestToken(token: IUSDCoins): Observable<boolean> {
    return this.getTestTokenClaimContract().pipe(
      switchMap(contract => {
        const tokenType = token === 'DAI' ? 1 : token === 'USDT' ? 2 : 3;
        return contract.claimTestToken(tokenType);
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public isTestTokenClaimed(userAddr: string, token: IUSDCoins): Observable<boolean> {
    return this.getTestTokenClaimContract().pipe(
      switchMap(contract => {
        const tokenType = token === 'DAI' ? 1 : token === 'USDT' ? 2 : 3;
        return from(contract.claimAdd(userAddr, tokenType) as Promise<BigNumber>);
      }),
      map((rs: BigNumber) => {
        return rs.gt(0);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public needApprove(
    amount: BigNumber,
    userAddr: string,
    contractAddr: string,
    erc20: ethers.Contract
  ): Observable<boolean> {
    return from(erc20.allowance(userAddr, contractAddr)).pipe(
      map((rs: any) => {
        const allowance = rs as BigNumber;
        return amount.gt(allowance);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(true);
      })
    );
  }

  public approve(contractAddr: string, erc20: ethers.Contract): Observable<boolean> {
    const maxApprove: string = '0x' + new Array(64).fill('f').join('');

    return from(erc20.approve(contractAddr, maxApprove)).pipe(
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public needApproveReToken(amount: number, address: string, reToken: IReUSDCoins): Observable<boolean> {
    const usdToken: IUSDCoins = ReTokenMapping[reToken];
    return zip(this.getMiningRewardContract(), this.getPubPoolContract(usdToken)).pipe(
      switchMap(([rewards, erc20]) => {
        const amountNum: BigNumber = tokenBigNumber(amount, reToken);
        return this.needApprove(amountNum, address, rewards.address, erc20);
      }),
      take(1),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public approveReToken(reToken: IReUSDCoins): Observable<boolean> {
    const usdToken: IUSDCoins = ReTokenMapping[reToken];
    return zip(this.getMiningRewardContract(), this.getPubPoolContract(usdToken)).pipe(
      switchMap(([rewards, erc20]) => {
        return this.approve(rewards.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public needApproveUSDFunding(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([trade, erc20]) => {
        const amountNum: BigNumber = tokenBigNumber(amount, usdToken);
        return this.needApprove(amountNum, address, trade.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public approveUSDFunding(usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([trade, erc20]) => {
        return this.approve(trade.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public needApprovePubPool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getPubPoolContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([pubPool, erc20]) => {
        const amountNum: BigNumber = tokenBigNumber(amount, usdToken);
        return this.needApprove(amountNum, address, pubPool.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public approvePubPool(usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getPubPoolContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([pubPool, erc20]) => {
        return this.approve(pubPool.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public needApprovePrivatePool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getPriPoolContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([priPool, erc20]) => {
        const amountNum: BigNumber = tokenBigNumber(amount, usdToken);
        return this.needApprove(amountNum, address, priPool.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public approvePrivatePool(usdToken: IUSDCoins): Observable<boolean> {
    return zip(this.getPriPoolContract(usdToken), this.getErc20USDContract(usdToken)).pipe(
      switchMap(([priPool, erc20]) => {
        return this.approve(priPool.address, erc20);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public getUserSelfWalletBalance(address: string): Observable<CoinBalance[]> {
    const dds$: Observable<CoinBalance> = this.getERC20DDSContract().pipe(
      switchMap((ddsContract: ethers.Contract) => {
        return from(ddsContract.balanceOf(address));
      }),
      map((rs: any) => {
        return { coin: MyTokenSymbol as ISLD, balance: rs as BigNumber };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ coin: MyTokenSymbol as ISLD, balance: BigNumber.from(0) });
      })
    );

    const dai$: Observable<CoinBalance> = this.getErc20USDContract('DAI').pipe(
      switchMap(daiContract => {
        return from(daiContract.balanceOf(address));
      }),
      map((rs: any) => {
        return { coin: 'DAI', balance: rs as BigNumber } as CoinBalance;
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ coin: 'DAI', balance: BigNumber.from(0) } as CoinBalance);
      })
    );

    const usdt$: Observable<CoinBalance> = of({ coin: 'USDT', balance: BigNumber.from(0) });
    const usdc$: Observable<CoinBalance> = of({ coin: 'USDC', balance: BigNumber.from(0) });

    return zip(dds$, dai$, usdt$, usdc$).pipe(
      catchError(err => {
        console.warn('error', err);
        return NEVER;
      })
    );
  }

  public getUserSelfReTokenBalance(address: string): Observable<CoinBalance[]> {
    const getBalance = (token: IUSDCoins): Observable<CoinBalance> => {
      return this.getPubPoolContract(token).pipe(
        switchMap(contract => {
          return contract.balanceOf(address);
        }),
        map((rs: any) => {
          return { coin: ('re' + token) as IReUSDCoins, balance: rs as BigNumber };
        }),
        catchError(err => {
          console.warn('error', err);
          return of({ coin: ('re' + token) as IReUSDCoins, balance: BigNumber.from(0) });
        })
      );
    };

    const obs: Observable<CoinBalance>[] = (['DAI', 'USDT', 'USDC'] as IUSDCoins[]).map(token => getBalance(token));
    return merge(...obs).pipe(toArray());
  }

  public getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        return this.getExchangeStr(coin).pipe(
          switchMap((pair: IExchangeStr) => {
            const funName: string = 'getPriceBy' + pair;
            return from(contract[funName]());
          })
        );
      }),
      map((num: any) => {
        return num as BigNumber;
      }),
      catchError(e => {
        console.warn('error', e);
        return EMPTY;
      })
    );
  }

  public watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getPriceByETHDAI(coin);
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => contract.functions.userAccount(address)),
      map((num: BigNumber[]) => ({ deposit: num[0], available: num[1] })),
      catchError(err => of({ deposit: BigNumber.from(0), available: BigNumber.from(0) }))
    );
  }

  public watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getUserAccount(address, coin);
      })
    );
  }

  public getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangeStr, maxUSDAmount: number): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        // 用户输入数字转成接口精度
        const usdAmount: BigNumber = BigNumber.from(1207000000).mul(ETH_WEIGHT);
        return contract.functions.getMaxOpenAmount(exchange, usdAmount);
      }),
      map((num: BigNumber[]) => {
        return num[0];
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public getMaxOpenTradeAmount(
    exchange: ExchangeCoinPair,
    type: ITradeType,
    availableUsdAmount: number
  ): Observable<BigNumber> {
    return this.getContract(exchange.USD).pipe(
      switchMap((contract: ethers.Contract) => {
        const exStr: IExchangeStr = fromExchangePair(exchange);
        const amount: BigNumber = tokenBigNumber(availableUsdAmount, exchange.USD);
        const contractType = type === 'LONG' ? 1 : 2;

        return from(contract.getMaxOpenAmount(exStr, amount, contractType));
      }),
      map((rs: any) => {
        return rs as BigNumber;
      }),
      catchError(err => {
        return of(BigNumber.from(0));
      })
    );
  }

  public watchMaxOpenAmount(coin: IUSDCoins, exchange: IExchangeStr): Observable<BigNumber> {
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
        const maxAmount = Number(toEthers(info.available, 0));
        return this.getMaxOpenAmount(coin, exchange, maxAmount);
      })
    );
  }

  // 存入usd token
  public depositToken(address: string, count: number, coin: IUSDCoins): Observable<boolean> {
    return this.getContract(coin).pipe(
      switchMap((tradeContract: ethers.Contract) => {
        const countNum: BigNumber = tokenBigNumber(count, coin);
        return from(tradeContract.deposit(countNum));
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public withdrawToken(count: number, coin: IUSDCoins): Observable<any> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const amount: BigNumber = tokenBigNumber(count, coin);
        return from(contract.withdraw(amount));
      }),
      switchMap((rs: any) => from(rs.wait())),
      mapTo(true),
      catchError(err => of(false))
    );
  }

  public confirmContract(exchangeStr: IExchangeStr, count: number, type: ITradeType): Observable<ConfirmInfo> {
    const exchange: ExchangeCoinPair = toExchangePair(exchangeStr);
    const contractType = type === 'LONG' ? 1 : 2;

    return this.getContract(exchange.USD).pipe(
      switchMap((contract: ethers.Contract) => {
        const amount: BigNumber = tokenBigNumber(count, exchange.USD);
        return from(contract.fees(exchangeStr, amount, contractType));
      }),
      map((rs: any) => {
        return rs;
      })
    );
  }

  public createContract(
    coin: IUSDCoins,
    orderType: ITradeType,
    amount: number,
    userPrice: number,
    inviter: string | null = '',
    slider: number = 0,
    timeout: number = 0
  ): Observable<string> {
    return this.getContract(coin).pipe(
      switchMap((tradeContract: ethers.Contract) => {
        const bigAmount = tokenBigNumber(amount, coin);
        const contractType: number = orderType === 'LONG' ? 1 : 2;
        const userInviter = inviter && inviter.length === 42 ? inviter : '0x0000000000000000000000000000000000000000';

        return zip(this.getExchangeStr(coin), this.getNetwork()).pipe(
          switchMap(([exchange, network]) => {
            const isBsc: boolean = network === EthNetwork.bianTest;

            if (isBsc) {
              const priceBigNum: BigNumber = tokenBigNumber(userPrice, coin);
              const sliderPriceUp: BigNumber = bigNumMultiple(priceBigNum, 100 + slider).div(100);
              const sliderPriceDn: BigNumber = bigNumMultiple(priceBigNum, 100 - slider).div(100);
              const now: number = Math.floor(new Date().getTime() / 1000);
              const deadline: number = Math.floor(now + timeout);

              //
              const args = [exchange, bigAmount, contractType, userInviter, sliderPriceDn, sliderPriceUp, deadline];
              return this.increaseGasLimit(tradeContract, 'creatContract', args);
            } else {
              const args = [exchange, bigAmount, contractType, userInviter];
              return this.increaseGasLimit(tradeContract, 'creatContract', args);
            }
          })
        );
      }),
      switchMap((rs: any) => {
        return rs.wait();
      }),
      map((rs: any) => {
        return rs.transactionHash as string;
      }),
      catchError(err => {
        console.warn('error', err);
        return of('');
      })
    );
  }

  public closeContract(order: ITradeRecord): Observable<boolean> {
    return this.getContract(order.costCoin).pipe(
      switchMap((contract: ethers.Contract) => {
        const id = BigNumber.from(order.id);
        return contract.functions.closecontract(id);
      }),
      switchMap(rs => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
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
        return from(contract.functions.getOrdersLen()).pipe(
          map((len: BigNumber[]) => {
            return new Array(len[0].toNumber()).fill(0).map((one, index) => BigNumber.from(index));
          })
        );
      }),
      switchMap((ids: BigNumber[]) => {
        const orderIds: BigNumber[] = ids;
        if (orderIds.length === 0) {
          return of([]);
        }

        const begin = (page - 1) * pageSize;
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
              return from(contract.functions.getOrderInfo(id)).pipe(map(info => ({ id, info })));
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
                network: '',
                hash: '',
                userAddress: address,
                id: order.id.toString(),
                time: Number(order.info.startTime.toString() + '000'),
                type: order.info.contractType.toString() === '1' ? 'LONG' : 'SHORT',
                amount: Number(toEthers(order.info.number, 4)),
                price: Number(toEthers(order.info.openPrice, 4)),
                closePrice: undefined,
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
      }),
      catchError(err => {
        console.warn('error', err);
        return [];
      })
    );
  }

  public getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangeStr, ethAmount: number): Observable<BigNumber> {
    return this.getContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        return this.getPriceByETHDAI(coin).pipe(
          switchMap((price: BigNumber) => {
            const amount: BigNumber = tokenBigNumber(ethAmount, 'ETH');
            return contract.functions.getLockedAmount(amount, price, exchange, '2');
          })
        );
      }),
      map((rs: any) => {
        return rs.marginFee;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  //
  public getPubPoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        return from(contract.getLPAmountInfo());
      }),
      map((rs: any) => {
        const total = Number(toEthers(rs.deposit, 4));
        const available = Number(toEthers(rs.availabe, 4));
        return {
          value: available,
          total,
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ value: 0, total: 0 });
      })
    );
  }

  public getPrivatePoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.getPriPoolContract(coin).pipe(
      switchMap(contract => {
        return contract.functions.getLPAmountInfo();
      }),
      map((rs: any) => {
        const total = Number(toEthers(rs.deposit, 4));
        const available = Number(toEthers(rs.availabe, 4));
        return {
          value: available,
          total,
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ value: 0, total: 0 });
      })
    );
  }

  public getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.getPubPoolContract(coin).pipe(
      switchMap(contract => {
        const bigAmount = tokenBigNumber(tokenAmount, coin);
        return contract.functions.getMintReDaiAmount(bigAmount);
      }),
      map(rs => {
        return rs.mintOtoken;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.getPubPoolContract(coin).pipe(
      switchMap(contract => {
        const bigAmount = tokenBigNumber(tokenAmount, coin);
        return contract.functions.getReTokenAmountByToken(bigAmount);
      }),
      map(rs => {
        return rs.retokenAmount;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public provideToPubPool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPubPoolContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const bigAmount: BigNumber = tokenBigNumber(coinAmount, coin);
        const max: string = '0x' + new Array(64).fill('f').join('');

        const allow$ = this.getErc20USDContract(coin).pipe(
          switchMap((usdContract: ethers.Contract) => {
            return from(usdContract.allowance(address, contract.address));
          }),
          map((rs: any) => {
            return rs as BigNumber;
          })
        );

        const approve$ = this.getErc20USDContract(coin).pipe(
          switchMap((usdContract: ethers.Contract) => {
            return usdContract.approve(contract.address, max);
          }),
          switchMap((rs: any) => {
            return from(rs.wait());
          })
        );

        const provide$ = this.increaseGasLimit(contract, 'provide', [bigAmount]).pipe(
          switchMap((rs: any) => {
            return from(rs.wait());
          })
        );

        return allow$.pipe(
          switchMap((allow: BigNumber) => {
            return allow.gte(bigAmount) ? provide$ : approve$.pipe(switchMap(() => provide$));
          })
        );
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean> {
    return this.getPubPoolContract(coin).pipe(
      switchMap(contract => {
        const bigAmount: BigNumber = tokenBigNumber(reCoinAmount, coin);
        return this.increaseGasLimit(contract, 'withdraw', [bigAmount]);
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        return of(false);
      })
    );
  }

  public pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance: Observable<BigNumber> = this.getPubPoolContract('DAI').pipe(
      switchMap(contract => {
        return from(contract.balanceOf(address)).pipe(
          switchMap((reToken: any) => {
            const reTokenNum: string = (reToken as BigNumber).toString();
            return reTokenNum === '0' ? of(BigNumber.from(0)) : from(contract.getTokenAmountByreToken(reToken));
          })
        );
      }),
      map((rs: any) => {
        return rs;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
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
        return rs.deposit as BigNumber;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
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

  public getUserReTokenShareInfo(address: string): Observable<CoinShare[]> {
    const queryFun = (token: IUSDCoins): Observable<CoinShare> => {
      return this.getPubPoolContract(token).pipe(
        switchMap((pubPoolContract: ethers.Contract) => {
          return from(pubPoolContract.getUserReToeknInfo(address)).pipe(
            switchMap((rs: any) => {
              const valueObs: Observable<BigNumber> = from(
                pubPoolContract.getTokenAmountByreToken(rs.selfReToken) as Promise<BigNumber>
              );
              const totalObs: Observable<BigNumber> = from(
                pubPoolContract.getTokenAmountByreToken(rs.total) as Promise<BigNumber>
              );
              return zip(valueObs, totalObs);
            }),
            map((values: BigNumber[]) => {
              return {
                coin: token,
                value: values[0],
                total: values[1],
              };
            })
          );
        }),
        catchError(err => {
          console.warn('error', err);
          return of({ coin: token, value: BigNumber.from(0), total: BigNumber.from(0) });
        })
      );
    };

    const zeroNum = BigNumber.from(0);
    const daiShareInfo: Observable<CoinShare> = queryFun('DAI');
    const usdtShareInfo: Observable<CoinShare> = of({ coin: 'USDT', value: zeroNum, total: zeroNum });
    const usdcShareInfo: Observable<CoinShare> = of({ coin: 'USDC', value: zeroNum, total: zeroNum });

    return zip(daiShareInfo, usdtShareInfo, usdcShareInfo).pipe(
      map((shares: CoinShare[]) => {
        return shares;
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
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
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

  public getPubPoolWithdrawDate(address: string): Observable<{ coin: IUSDCoins; time: number }[]> {
    const addition = 14 * 24 * 3600; // 14 days （秒）

    const dai$ = this.getPubPoolContract('DAI').pipe(
      switchMap(contract => {
        return from(contract.functions.lastProvideTm(address));
      }),
      map((rs: BigNumber[]) => {
        return { coin: 'DAI' as IUSDCoins, time: (rs[0].toNumber() + addition) * 1000 }; // 转毫秒
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ coin: 'DAI' as IUSDCoins, time: 0 });
      })
    );
    const usdt$ = of({ coin: 'USDT' as IUSDCoins, time: 0 });
    const usdc$ = of({ coin: 'USDC' as IUSDCoins, time: 0 });

    return zip(dai$, usdt$, usdc$);
  }

  //
  public getLockedLiquidityList(
    address: string,
    page: number,
    pageSize: number,
    devTest = false
  ): Observable<PrivateLockLiquidity[]> {
    return this.getPriPoolContract('DAI').pipe(
      switchMap(contract => {
        return from(contract.functions.getlockedLiquidityLen()).pipe(
          map(rs => {
            return rs.lpLen;
          }),
          switchMap((len: BigNumber) => {
            const getOneOrder = (index: number): Observable<any> => {
              return from(contract.functions.lockedLiquidity(BigNumber.from(index))).pipe(
                map((rs: PrivateLockLiquidity) => {
                  const newRs = Object.assign({}, rs);
                  newRs.orderId = index;
                  newRs.usdToken = 'DAI';
                  newRs.status = rs.locked ? 'ACTIVE' : 'CLOSED';
                  return newRs;
                })
              );
            };

            if (devTest) {
              // TODO 使用address过滤，得到当前用户的交易单
              const total = len.toNumber();
              const range = getPageListRange(total, page, pageSize);
              const obs: Observable<any>[] = [];
              for (let i = 0; i < range.count; i++) {
                obs.push(getOneOrder(i + range.from));
              }

              return merge(...obs).pipe(
                reduce((acc: any[], one: any) => {
                  acc.push(one);
                  return acc;
                }, [])
              );
            } else {
              return from(new Array(len.toNumber()).fill(0).map((one, index: number) => index)).pipe(
                concatMap((index: number) => {
                  return getOneOrder(index);
                }),
                filter((one: PrivateLockLiquidity) => {
                  return one.makerAddr === address;
                }),
                take(pageSize), // TODO 当前的查询方式几乎不能支持分页，默认第一页
                reduce((acc: PrivateLockLiquidity[], one: PrivateLockLiquidity) => {
                  acc.push(one);
                  return acc;
                }, []),
                catchError(err => {
                  console.warn('error', err);
                  return of([]);
                })
              );
            }
          })
        );
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  public addMarginAmount(orderId: string, coin: IUSDCoins, amount: number): Observable<boolean> {
    return this.getPriPoolContract(coin).pipe(
      switchMap((contract: ethers.Contract) => {
        const bigAmount = tokenBigNumber(amount, coin);
        return contract.functions.addMarginAmount(orderId, bigAmount);
      }),
      switchMap(rs => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        return of(false);
      })
    );
  }

  public provideToPrivatePool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPriPoolContract(coin).pipe(
      switchMap((priPoolContract: ethers.Contract) => {
        const bigAmount = tokenBigNumber(coinAmount, coin);
        const max: string = '0x' + new Array(64).fill('f').join('');

        const getAllownce = (): Observable<BigNumber> => {
          return this.getErc20USDContract(coin).pipe(
            switchMap(usdContract => {
              return from(usdContract.allowance(address, priPoolContract.address));
            }),
            map(rs => {
              return rs as BigNumber;
            })
          );
        };

        const doProvide = (): Observable<any> => {
          return from(priPoolContract.provide(bigAmount)).pipe(
            switchMap((rs: any) => {
              return from(rs.wait());
            })
          );
        };

        const doApprove = (): Observable<any> => {
          return this.getErc20USDContract(coin).pipe(
            switchMap(usdContract => {
              return from(usdContract.approve(priPoolContract.address, max));
            }),
            switchMap((rs: any) => from(rs.wait()))
          );
        };

        return getAllownce().pipe(
          switchMap(allow => {
            if (allow.gte(bigAmount)) {
              return doProvide();
            } else {
              return doApprove().pipe(
                switchMap(() => {
                  return doProvide();
                })
              );
            }
          }),
          mapTo(true)
        );
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.getPriPoolContract(coin).pipe(
      switchMap(contract => {
        const bigAmount: BigNumber = tokenBigNumber(coinAmount, coin);
        return contract.withdraw(bigAmount);
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        return of(false);
      })
    );
  }

  public priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    const daiBalance = this.getPriPoolContract('DAI').pipe(
      switchMap(contract => {
        return contract.functions.lpAccount(address);
      }),
      map((rs: any) => {
        return rs.availableAmount;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
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

  // public priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
  //   const daiBalance: Observable<BigNumber> = this.getPriPoolContract('DAI').pipe(
  //     switchMap((contract: ethers.Contract) => {
  //       return contract.functions.getLPAmountInfo();
  //     }),
  //     map((rs: any) => {
  //       return rs.deposit as BigNumber;
  //     })
  //   );
  //
  //   const usdtBalance = of(BigNumber.from(0));
  //   const usdcBalance = of(BigNumber.from(0));
  //
  //   return zip(daiBalance, usdtBalance, usdcBalance).pipe(
  //     map((balances: BigNumber[]) => {
  //       const rs = new Map();
  //       rs.set('DAI', balances[0]);
  //       rs.set('USDT', balances[1]);
  //       rs.set('USDC', balances[2]);
  //       return rs;
  //     })
  //   );
  // }

  public setPriPoolRejectOrder(isReject: boolean): Observable<boolean> {
    return this.getPriPoolContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return from(contract.setIsRejectOrder(isReject) as Promise<any>);
      }),
      switchMap((rs: any) => {
        return rs.wait();
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error:', err);
        return of(false);
      })
    );
  }

  public priPoolUserBalance(address: string): Observable<PrivatePoolAccountInfo> {
    const dai$ = this.getPriPoolContract('DAI').pipe(
      switchMap((contract: ethers.Contract) => {
        return contract.functions.lpAccount(address);
      }),
      map((rs: any) => {
        return {
          total: rs.amount,
          available: rs.availableAmount,
          locked: rs.lockedAmount,
          isRejectOrder: rs.isRejectOrder,
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          total: BigNumber.from(0),
          available: BigNumber.from(0),
          locked: BigNumber.from(0),
          isRejectOrder: false,
        });
      })
    );

    const z: BigNumber = BigNumber.from(0);
    const usdt$ = of({ total: z, available: z, locked: z, isRejectOrder: false });
    const usdc$ = of({ total: z, available: z, locked: z, isRejectOrder: false });

    return zip(dai$, usdt$, usdc$).pipe(
      map(
        ([dai, usdt, usdc]: {
          total: BigNumber;
          available: BigNumber;
          locked: BigNumber;
          isRejectOrder: boolean;
        }[]) => {
          return {
            total: [
              {
                coin: 'DAI',
                balance: dai.total,
              },
              {
                coin: 'USDT',
                balance: usdt.total,
              },
              {
                coin: 'USDC',
                balance: usdc.total,
              },
            ],
            available: [
              {
                coin: 'DAI',
                balance: dai.available,
              },
              {
                coin: 'USDT',
                balance: usdt.available,
              },
              {
                coin: 'USDC',
                balance: usdc.available,
              },
            ],
            locked: [
              {
                coin: 'DAI',
                balance: dai.locked,
              },
              {
                coin: 'USDT',
                balance: usdt.locked,
              },
              {
                coin: 'USDC',
                balance: usdc.locked,
              },
            ],
            isRejectOrder: [
              {
                coin: 'DAI',
                reject: dai.isRejectOrder,
              },
              {
                coin: 'USDT',
                reject: usdt.isRejectOrder,
              },
              {
                coin: 'USDC',
                reject: usdc.isRejectOrder,
              },
            ],
          };
        }
      )
    );
  }

  //

  public getLiquidityMiningReward(address: string): Observable<BigNumber> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return from(rewardContract.queryRewardsForLP1(address) as Promise<BigNumber>);
      }),
      map(rs => {
        return rs;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public getPubPoolLiquidityShareInfo(address: string): Observable<PubPoolLockInfo> {
    return this.getMiningRewardContract().pipe(
      switchMap((rewardContract: ethers.Contract) => {
        return from(rewardContract.queryStakeShareInfoForLP1(address));
      }),
      map((rs: any) => {
        return {
          lockedReToken: {
            reDAI: rs.reDAI,
            reUSDT: rs.reUSDT,
            reUSDC: rs.reUSDC,
          },
          totalLockedReToken: {
            reDAI: rs.totalReDAI,
            reUSDT: rs.totalReUSDT,
            reUSDC: rs.totalReUSDC,
          },
          lpToken: {
            lpDAI: rs.shareDAI,
            lpUSDT: rs.shareUSDT,
            lpUSDC: rs.shareUSDC,
          },
          totalLpToken: {
            lpDAI: rs.totalShareDAI,
            lpUSDT: rs.totalShareUSDT,
            lpUSDC: rs.totalShareUSDC,
          },
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          lockedReToken: {
            reDAI: BigNumber.from(0),
            reUSDT: BigNumber.from(0),
            reUSDC: BigNumber.from(0),
          },
          totalLockedReToken: {
            reDAI: BigNumber.from(0),
            reUSDT: BigNumber.from(0),
            reUSDC: BigNumber.from(0),
          },
          lpToken: {
            lpDAI: BigNumber.from(0),
            lpUSDT: BigNumber.from(0),
            lpUSDC: BigNumber.from(0),
          },
          totalLpToken: {
            lpDAI: BigNumber.from(0),
            lpUSDT: BigNumber.from(0),
            lpUSDC: BigNumber.from(0),
          },
        });
      })
    );
  }

  public getLiquidityMiningShare(address: string): Observable<CoinShare[]> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return from(rewardContract.queryStakeShareInfoForLP1(address) as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        return [
          { coin: 'DAI' as const, value: rs[0], total: rs[3] },
          { coin: 'USDT' as const, value: rs[1], total: rs[4] },
          { coin: 'USDC' as const, value: rs[2], total: rs[5] },
        ];
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  public getActiveLiquidityRewards(address: string): Observable<BigNumber> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return from(rewardContract.queryRewardsForLP2(address) as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        return rs[0];
      }),
      catchError(err => {
        console.warn('error', err);
        return of(BigNumber.from(0));
      })
    );
  }

  public lockReTokenForLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return this.getReTokenContractAddress(reToken).pipe(
          switchMap((reTokenAddr: string | null) => {
            if (reTokenAddr) {
              const reTokenNum: BigNumber = tokenBigNumber(reTokenAmount);
              console.log('retoken addr', reTokenAddr);
              return from(rewardContract.stakeForLP1(reTokenAddr, reTokenNum));
            } else {
              throw new Error('Can not get reToken contract address.');
            }
          })
        );
      }),
      switchMap((rs: any) => {
        return rs.wait();
      }),
      map(rs => {
        return true;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public unLockReTokenFromLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean> {
    return this.getMiningRewardContract().pipe(
      switchMap((rewardContract: ethers.Contract) => {
        return this.getReTokenContractAddress(reToken).pipe(
          switchMap((reTokenAddr: string | null) => {
            if (reTokenAddr) {
              const reTokenNum: BigNumber = tokenBigNumber(reTokenAmount, reToken);
              return from(rewardContract.withdrawForLP1(reTokenAddr, reTokenNum));
            } else {
              throw new Error('Can not get reToken contract address.');
            }
          })
        );
      }),
      switchMap((rs: any) => {
        return rs.wait();
      }),
      map(rs => {
        console.log('rs =', rs);
        return true;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public getReTokenLiquidityReward(address: string): Observable<PubPoolRewards> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return from(rewardContract.queryRewardsForLP1(address) as Promise<BigNumber[]>);
      }),
      retryWhen(errorsObs => {
        return errorsObs.pipe(
          tap(err => {
            console.log('err is', err);
          }),
          delay(3000)
        );
      }),
      map((rs: BigNumber[]) => {
        return {
          available: rs[0] as BigNumber,
          vesting: rs[1] as BigNumber,
          unactivated: rs[2] as BigNumber,
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          available: BigNumber.from(0),
          vesting: BigNumber.from(0),
          unactivated: BigNumber.from(0),
        });
      })
    );
  }

  public claimRewardsForLP1(): Observable<boolean> {
    return this.getMiningRewardContract().pipe(
      switchMap((rewardContract: ethers.Contract) => {
        console.log(rewardContract.address, 'claimRewardsForLP1');
        return from(rewardContract.claimRewardsForLP1());
      }),
      switchMap((rs: any) => {
        console.log('get wait ', rs);
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('claimRewardsForLP1 error', err);
        return of(false);
      })
    );
  }

  public claimRewardsForLP2(): Observable<boolean> {
    return this.getMiningRewardContract().pipe(
      switchMap(rewardContract => {
        return from(rewardContract.claimRewardsForLP2());
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public getSystemFundingBalance(): Observable<CoinBalance[]> {
    const dai$ = this.getERC20DDSContract().pipe(
      switchMap(ddsContract => {
        return from(ddsContract.balanceOf(SystemFundingAccount) as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        return rs[0];
      }),
      catchError(err => {
        console.log('error', err);
        return of(BigNumber.from(0));
      })
    );
    const usdt$ = of(BigNumber.from(0));
    const usdc$ = of(BigNumber.from(0));

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

  // 获取某位清算者的稳定币奖励总数
  public getLiquiditorRewards(address: string): Observable<LiquditorRewardsResult> {
    return this.getLiquidatorContract().pipe(
      switchMap((liqContract: ethers.Contract) => {
        return from(liqContract.getFeeBackByLiquidor(address) as Promise<BigNumber[]>);
      }),
      map(
        (rs: BigNumber[]): LiquditorRewardsResult => {
          const usdRewards: CoinBalance[] = [
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
          ];
          const compensate = rs[3]; // reward when empty
          const campaign: BigNumber = rs.length >= 5 ? rs[4] : BigNumber.from(0);
          const rank: BigNumber = rs.length >= 6 ? rs[5] : BigNumber.from(0);

          return {
            usdRewards,
            campaign,
            compensate,
            rank,
          };
        }
      ),
      catchError(err => {
        console.warn('error', err);
        return of({
          usdRewards: [
            { coin: 'DAI', balance: BigNumber.from(0) },
            { coin: 'USDT', balance: BigNumber.from(0) },
            { coin: 'USDC', balance: BigNumber.from(0) },
          ],
          campaign: BigNumber.from(0),
          compensate: BigNumber.from(0),
          rank: BigNumber.from(0),
        } as LiquditorRewardsResult);
      })
    );
  }

  public getLiquiditorPeriod(): Observable<{ startTime: BigNumber; period: BigNumber }> {
    return this.getLiquidatorContract().pipe(
      switchMap((liqContract: ethers.Contract) => {
        return from(liqContract.getStartTimeAndCurrentPeriod());
      }),
      map((rs: any) => {
        return { startTime: rs.time as BigNumber, period: rs.period as BigNumber };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({ startTime: BigNumber.from(0), period: BigNumber.from(0) });
      })
    );
  }

  // 获取当前周期的清算者的奖励信息
  public getLiquiditorRewardsOfPeriod(
    address: string,
    period: number
  ): Observable<{
    rewards: CoinBalance[];
    info: { extSLD: BigNumber; rank: BigNumber };
  }> {
    return this.getLiquidatorContract().pipe(
      switchMap((liqContract: ethers.Contract) => {
        return from(liqContract.getFeeBackByLiquidorAndPeriod(address, BigNumber.from(period)));
      }),
      map((rs: any) => {
        return {
          rewards: [
            { coin: 'DAI' as const, balance: rs[0] as BigNumber },
            { coin: 'USDT' as const, balance: rs[1] as BigNumber },
            { coin: 'USDC' as const, balance: rs[2] as BigNumber },
            { coin: MyTokenSymbol, balance: rs[3] as BigNumber },
          ],
          info: { extSLD: rs[4] as BigNumber, rank: rs[5] as BigNumber },
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          rewards: [
            { coin: 'DAI' as const, balance: BigNumber.from(0) },
            { coin: 'USDT' as const, balance: BigNumber.from(0) },
            { coin: 'USDC' as const, balance: BigNumber.from(0) },
            { coin: MyTokenSymbol, balance: BigNumber.from(0) },
          ],
          info: { extSLD: BigNumber.from(0), rank: BigNumber.from(0) },
        });
      })
    );
  }

  public getLiquiditorRatingList(period: number): Observable<string[]> {
    return this.getLiquidatorContract().pipe(
      switchMap((liqContract: ethers.Contract) => {
        return from(liqContract.getLiquidorsRatingList(BigNumber.from(period)) as Promise<string[]>);
      }),
      map((rs: string[]) => {
        return rs;
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  public getSwapBurnInfo(): Observable<CoinBalance[]> {
    return this.getSwapBurnContract().pipe(
      switchMap(swapContract => {
        return from(swapContract.getBuyBackInfo() as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]): CoinBalance[] => {
        return [
          {
            coin: MyTokenSymbol,
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
        ];
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  //
  public doSwap(address: string, coin: IUSDCoins, ddsAmount: number): Observable<boolean> {
    const coinType: 1 | 2 | 3 = coin === 'DAI' ? 1 : coin === 'USDT' ? 2 : 3;
    const tokenType: BigNumber = BigNumber.from(coinType);
    const tokenAmount: BigNumber = tokenBigNumber(ddsAmount, MyTokenSymbol);
    const max: string = '0x' + new Array(64).fill('f').join('');

    return this.getSwapBurnContract().pipe(
      switchMap((swapContract: ethers.Contract) => {
        const approve$ = this.getERC20DDSContract().pipe(
          switchMap((ddsContract: ethers.Contract) => {
            return from(ddsContract.approve(swapContract.address, max));
          }),
          switchMap((rs: any) => {
            return from(rs.wait());
          })
        );

        const allow$ = this.getERC20DDSContract().pipe(
          switchMap((ddsContract: ethers.Contract) => {
            return ddsContract.allowance(address, swapContract.address);
          }),
          map((rs: any) => {
            return rs as BigNumber;
          })
        );

        const swap$ = from(swapContract.swap(tokenType, tokenAmount)).pipe(
          switchMap((rs: any) => {
            return from(rs.wait());
          })
        );

        return allow$.pipe(
          switchMap((allow: BigNumber) => {
            return allow.gte(tokenAmount) ? swap$ : approve$.pipe(switchMap(() => swap$));
          })
        );
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  public getBrokerInfo(address: string): Observable<{ refer: BigNumber; claim: CoinBalance[]; rank: BigNumber }> {
    return this.getBrokerContract().pipe(
      switchMap(contract => {
        return from(contract.getBrokerInfo(address) as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        const dai: BigNumber = rs[0];
        const usdt: BigNumber = rs[1];
        const usdc: BigNumber = rs[2];
        const count: BigNumber = rs[3];
        let rank = BigNumber.from(0);
        if (rs.length === 5) {
          rank = rs[4];
        }

        return {
          refer: count,
          rank: rank,
          claim: [
            { coin: 'DAI' as const, balance: dai },
            { coin: 'USDT' as const, balance: usdt },
            { coin: 'USDC' as const, balance: usdc },
          ],
        };
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          refer: BigNumber.from(0),
          rank: BigNumber.from(0),
          claim: [],
        });
      })
    );
  }

  // broker所有的累积手续费分成，包含为claim的
  public getBrokerAllCommission(address: string): Observable<CoinBalance[]> {
    return this.getBrokerContract().pipe(
      switchMap(contract => {
        return from(contract.getBrokerAwardsInfo(address) as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        return [
          { coin: 'DAI' as const, balance: rs[0] },
          { coin: 'USDT' as const, balance: rs[1] },
          { coin: 'USDC' as const, balance: rs[2] },
        ];
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  // 查询broker的月度累积奖励的信息
  public getBrokerMonthlyAwardsInfo(address: string): Observable<CoinBalance[]> {
    return this.getBrokerContract().pipe(
      switchMap(brokerContract => {
        return from(brokerContract.getBrokerMonthlyAwardsInfo(address));
      }),
      map((rs: any) => {
        const balance = rs as BigNumber[];
        return [
          { coin: 'DAI' as const, balance: balance[0] },
          { coin: 'USDT' as const, balance: balance[1] },
          { coin: 'USDC' as const, balance: balance[2] },
        ] as CoinBalance[];
      }),
      catchError(err => {
        console.warn('error', err);
        return of([]);
      })
    );
  }

  // 查询活动开始时间
  public getBrokerMonthlyStartTime(): Observable<number> {
    return this.getBrokerContract().pipe(
      switchMap(brokerContract => {
        return from(brokerContract.getStartTime());
      }),
      map(rs => {
        return (rs as BigNumber).toNumber() * 1000;
      }),
      catchError(err => {
        console.warn('error', err);
        return of(0);
      })
    );
  }

  // 查询月活动奖池中的当前余额
  public getBrokerMonthlyRewardPool(): Observable<CoinBalance[]> {
    return this.getBrokerContract().pipe(
      switchMap(brokerContract => {
        return from(brokerContract.getTotalMonthlyAwards() as Promise<BigNumber[]>);
      }),
      map((rs: BigNumber[]) => {
        const balances: CoinBalance[] = (['DAI', 'USDT', 'USDC'] as IUSDCoins[]).map((coin, index) => {
          return {
            coin,
            balance: rs[index],
          };
        });

        return balances;
      }),
      catchError(err => {
        console.warn('error', err);
        return [];
      })
    );
  }

  public doBrokerClaim(): Observable<boolean> {
    return this.getBrokerContract().pipe(
      switchMap(contract => {
        return from(contract.claimRewardsForBroker());
      }),
      switchMap((rs: any) => {
        return from(rs.wait());
      }),
      mapTo(true),
      catchError(err => {
        console.warn('error', err);
        return of(false);
      })
    );
  }

  protected increaseGasLimit(contract: ethers.Contract, funName: string, args: any[]): Observable<any> {
    return from(contract.estimateGas[funName](...args)).pipe(
      switchMap((gas: BigNumber) => {
        return contract.functions[funName](...args, { gasLimit: BigNumber.from(Math.ceil(gas.toNumber() * 1.5)) });
      })
    );
  }

  protected getReTokenContractAddress(reToken: IReUSDCoins): Observable<string | null> {
    return this.getNetwork().pipe(
      map((network: EthNetwork) => {
        switch (reToken) {
          case 'reDAI': {
            return ContractAddressByNetwork[network].Lp1DAIContract;
          }
          case 'reUSDC': {
            return ContractAddressByNetwork[network].Lp1USDCContract;
          }
          case 'reUSDT': {
            return ContractAddressByNetwork[network].Lp1USDTContract;
          }
          default: {
            return null;
          }
        }
      })
    );
  }

  protected abstract getERC20DDSContract(): Observable<ethers.Contract>;

  protected abstract getErc20USDContract(coin: IUSDCoins): Observable<ethers.Contract>;

  protected abstract getContract(coin: IUSDCoins): Observable<ethers.Contract>;

  protected abstract getPubPoolContract(coin: IUSDCoins): Observable<ethers.Contract>;

  protected abstract getPriPoolContract(coin: IUSDCoins): Observable<ethers.Contract>;

  protected abstract getMiningRewardContract(): Observable<ethers.Contract>;

  protected abstract getSwapBurnContract(): Observable<ethers.Contract>;

  protected abstract getLiquidatorContract(): Observable<ethers.Contract>;

  protected abstract getBrokerContract(): Observable<ethers.Contract>;

  protected abstract getTestTokenClaimContract(): Observable<ethers.Contract>;

  protected abstract getAirDropContract(): Observable<ethers.Contract>;

  protected abstract getContractAddress(contract: keyof ContractAddress): Observable<string>;

  protected abstract confirmChainExchangePair(pair: ExchangeCoinPair): Observable<ExchangeCoinPair>;

  protected abstract getExchangeStr(coin: IUSDCoins): Observable<IExchangeStr>;

  protected abstract getProvider(): ethers.providers.BaseProvider;

  protected abstract getSigner(): ethers.Signer | undefined;

  public abstract getNetwork(): Observable<EthNetwork>;
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseTradeContractAccessor {
  public readonly transferable = true;

  protected getERC20DDSContract(): Observable<ethers.Contract> {
    return this.getAContract('ERC20DDS');
  }

  protected getErc20USDContract(coin: IUSDCoins): Observable<ethers.Contract> {
    switch (coin) {
      case 'DAI': {
        return this.getAContract('ERC20DAI');
      }
      case 'USDT': {
        return this.getAContract('ERC20USDT');
      }
      case 'USDC': {
        return this.getAContract('ERC20USDC');
      }
      default: {
        return this.getAContract('ERC20DAI');
      }
    }
  }

  protected getContract(coin: IUSDCoins): Observable<ethers.Contract> {
    switch (coin) {
      case 'DAI': {
        return this.getAContract('TradeDAIContract');
      }
      case 'USDT': {
        return this.getAContract('TradeUSDTContract');
      }
      case 'USDC': {
        return this.getAContract('TradeUSDCContract');
      }
      default: {
        return this.getAContract('TradeDAIContract');
      }
    }
  }

  protected getPubPoolContract(coin: IUSDCoins): Observable<ethers.Contract> {
    switch (coin) {
      case 'DAI': {
        return this.getAContract('Lp1DAIContract');
      }
      case 'USDT': {
        return this.getAContract('Lp1USDTContract');
      }
      case 'USDC': {
        return this.getAContract('Lp1USDCContract');
      }
      default: {
        return this.getAContract('Lp1DAIContract');
      }
    }
  }

  protected getPriPoolContract(coin: IUSDCoins): Observable<ethers.Contract> {
    switch (coin) {
      case 'DAI': {
        return this.getAContract('Lp2DAIContract');
      }
      case 'USDT': {
        return this.getAContract('Lp2USDTContract');
      }
      case 'USDC': {
        return this.getAContract('Lp2USDCContract');
      }
      default: {
        return this.getAContract('Lp2DAIContract');
      }
    }
  }

  protected getMiningRewardContract(): Observable<ethers.Contract> {
    return this.getAContract('MiningRewardContract');
  }

  protected getLiquidatorContract(): Observable<ethers.Contract> {
    return this.getAContract('LiquidatorContract');
  }

  protected getBrokerContract(): Observable<ethers.Contract> {
    return this.getAContract('BrokerContract');
  }

  protected getSwapBurnContract(): Observable<ethers.Contract> {
    return this.getAContract('SwapBurnContract');
  }

  protected getTestTokenClaimContract(): Observable<ethers.Contract> {
    return this.getAContract('ReceiveTestTokenContract');
  }

  protected getAirDropContract(): Observable<ethers.Contract> {
    return this.getAContract('AirDropContract');
  }

  protected getContractAddress(contract: keyof ContractAddress): Observable<string> {
    return this.getNetwork().pipe(
      map((network: EthNetwork) => {
        return getContractAddress(network, contract);
      })
    );
  }

  protected getProvider(): ethers.providers.Web3Provider {
    return new ethers.providers.Web3Provider(window.ethereum, 'any');
  }

  protected getSigner(): ethers.Signer {
    return this.getProvider().getSigner();
  }

  protected confirmChainExchangePair(pair: ExchangeCoinPair): Observable<ExchangeCoinPair> {
    return this.getNetwork().pipe(
      map(network => {
        return pair;
      })
    );
  }

  // TODO 只处理当前链Token与USD的交易，未来引入BTC后再调整
  protected getExchangeStr(coin: IUSDCoins): Observable<IExchangeStr> {
    return of(('ETH' + coin) as IExchangeStr);
  }

  public getNetwork(): Observable<EthNetwork> {
    return walletManager
      .getMetamaskIns()
      .watchNetwork()
      .pipe(
        filter((n: string | null) => n !== null),
        map(network => network as EthNetwork),
        take(1)
      );
  }

  private getAContract(contract: keyof ContractAddress): Observable<ethers.Contract> {
    return this.getNetwork().pipe(
      map((network: EthNetwork) => {
        const { abi, address } = getContractInfo(network, contract);
        return new ethers.Contract(address, abi, this.getSigner());
      })
    );
  }
}

/**
 * 合约访问工具
 */
export class ContractAccessor implements ContractProxy {
  //
  private readonly metamaskAccessor: MetamaskContractAccessor | null;

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
      map(a => a as BaseTradeContractAccessor),
      switchMap(a => {
        return a.getNetwork().pipe(
          filter((network: EthNetwork) => SupportedNetwork.indexOf(network) >= 0),
          map(() => a) // TODO optimize
        );
      }),
      take(1)
    );
  }

  public watchContractAccessor(): Observable<BaseTradeContractAccessor> {
    return this.curAccessor.pipe(filter(a => a !== null)) as Observable<BaseTradeContractAccessor>;
  }

  public airDropWhiteList(address: string): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.airDropWhiteList(address);
      })
    );
  }

  public airDropClaim(): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.airDropClaim();
      })
    );
  }

  public claimTestToken(token: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.claimTestToken(token);
      })
    );
  }

  public isTestTokenClaimed(userAddr: string, token: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.isTestTokenClaimed(userAddr, token);
      })
    );
  }

  public needApproveReToken(amount: number, address: string, reToken: IReUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.needApproveReToken(amount, address, reToken);
      })
    );
  }

  public approveReToken(reToken: IReUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.approveReToken(reToken);
      })
    );
  }

  public needApproveUSDFunding(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.needApproveUSDFunding(amount, address, usdToken);
      })
    );
  }

  public approveUSDFunding(usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.approveUSDFunding(usdToken);
      })
    );
  }

  public needApprovePubPool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.needApprovePubPool(amount, address, usdToken);
      })
    );
  }

  public approvePubPool(usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.approvePubPool(usdToken);
      })
    );
  }

  public needApprovePrivatePool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.needApprovePrivatePool(amount, address, usdToken);
      })
    );
  }

  public approvePrivatePool(usdToken: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.approvePrivatePool(usdToken);
      })
    );
  }

  public getUserSelfWalletBalance(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getUserSelfWalletBalance(address);
      })
    );
  }

  public getUserSelfReTokenBalance(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getUserSelfReTokenBalance(address);
      })
    );
  }

  public getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.accessor.pipe(switchMap(accessor => accessor.getPriceByETHDAI(coin)));
  }

  public watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap((accessor: BaseTradeContractAccessor) => {
        return accessor.watchPriceByETHDAI(coin);
      })
    );
  }

  public getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.accessor.pipe(switchMap(accessor => accessor.getUserAccount(address, coin)));
  }

  public watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.watchUserAccount(address, coin);
      })
    );
  }

  public getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangeStr, maxUSDAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getMaxOpenAmount(coin, exchange, maxUSDAmount);
      })
    );
  }

  public getMaxOpenTradeAmount(
    exchange: ExchangeCoinPair,
    type: ITradeType,
    availableUsdAmount: number
  ): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => accessor.getMaxOpenTradeAmount(exchange, type, availableUsdAmount))
    );
  }

  public depositToken(address: string, count: number, coin: IUSDCoins): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.depositToken(address, count, coin);
      })
    );
  }

  public withdrawToken(count: number, coin: IUSDCoins): Observable<any> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.withdrawToken(count, coin);
      }),
      catchError(err => {
        return of(false);
      })
    );
  }

  public confirmContract(exchangeStr: IExchangeStr, count: number, type: ITradeType): Observable<ConfirmInfo> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.confirmContract(exchangeStr, count, type);
      }),
      catchError(err => {
        console.warn('error', err);
        return of({
          currentPrice: BigNumber.from(0),
          exchgFee: BigNumber.from(0),
          openFee: BigNumber.from(0),
          total: BigNumber.from(0),
        });
      })
    );
  }

  public createContract(
    coin: IUSDCoins,
    orderType: ITradeType,
    amount: number,
    userPrice: number,
    inviter: string | null = '',
    slider: number = 0,
    timeout: number = 0
  ): Observable<string> {
    return this.accessor.pipe(
      switchMap(accessor => accessor.createContract(coin, orderType, amount, userPrice, inviter, slider, timeout))
    );
  }

  public closeContract(orderId: ITradeRecord): Observable<boolean> {
    return this.accessor.pipe(switchMap(accessor => accessor.closeContract(orderId)));
  }

  public getUserOrders(address: string, curPrice: BigNumber, page: number, pageSize: number): Observable<any> {
    return this.accessor.pipe(switchMap(accessor => accessor.getUserOrders(address, curPrice, page, pageSize)));
  }

  public getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangeStr, ethAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(switchMap(accessor => accessor.getFundingLockedAmount(coin, exchange, ethAmount)));
  }

  //

  public getPubPoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.accessor.pipe(switchMap(accessor => accessor.getPubPoolInfo(coin)));
  }

  public getPrivatePoolInfo(coin: IUSDCoins): Observable<CoinAvailableInfo> {
    return this.accessor.pipe(switchMap(accessor => accessor.getPrivatePoolInfo(coin)));
  }

  public getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getPubPoolDepositReTokenFromToken(coin, tokenAmount);
      })
    );
  }

  public getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getPubPoolWithdrawReTokenFromToken(coin, tokenAmount);
      })
    );
  }

  public provideToPubPool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.provideToPubPool(address, coin, coinAmount);
      })
    );
  }

  public withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.withdrawFromPubPool(coin, reCoinAmount);
      })
    );
  }

  public pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.pubPoolBalanceOf(address);
      }),
      catchError(err => {
        console.warn('error', address, err);
        return of(new Map());
      })
    );
  }

  public pubPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.pubPoolBalanceWhole();
      }),
      catchError(err => {
        console.warn('error ', err);
        return of(new Map());
      })
    );
  }

  public getUserReTokenShareInfo(address: string): Observable<CoinShare[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getUserReTokenShareInfo(address);
      })
    );
  }

  public getReTokenBalance(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getReTokenBalance(address);
      })
    );
  }

  public getPubPoolWithdrawDate(address: string): Observable<{ coin: IUSDCoins; time: number }[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getPubPoolWithdrawDate(address);
      })
    );
  }

  //

  public getLockedLiquidityList(
    address: string,
    page: number,
    pageSize: number,
    devTest = false
  ): Observable<PrivateLockLiquidity[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLockedLiquidityList(address, page, pageSize, devTest);
      })
    );
  }

  public addMarginAmount(orderId: string, coin: IUSDCoins, amount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.addMarginAmount(orderId, coin, amount);
      })
    );
  }

  public provideToPrivatePool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.provideToPrivatePool(address, coin, coinAmount);
      })
    );
  }

  public withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.withdrawFromPrivatePool(coin, coinAmount);
      })
    );
  }

  public priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.priPoolBalanceOf(address);
      })
    );
  }

  public setPriPoolRejectOrder(isReject: boolean): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.setPriPoolRejectOrder(isReject);
      })
    );
  }

  // public priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>> {
  //   return this.accessor.pipe(
  //     switchMap(accessor => {
  //       return accessor.priPoolBalanceWhole();
  //     })
  //   );
  // }

  public priPoolUserBalance(address: string): Observable<PrivatePoolAccountInfo> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.priPoolUserBalance(address);
      })
    );
  }

  public getSystemFundingBalance(): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getSystemFundingBalance();
      })
    );
  }

  public getLiquiditorRewards(address: string): Observable<LiquditorRewardsResult> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquiditorRewards(address);
      })
    );
  }

  public getLiquiditorPeriod(): Observable<{ startTime: BigNumber; period: BigNumber }> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquiditorPeriod();
      })
    );
  }

  public getLiquiditorRewardsOfPeriod(
    address: string,
    period: number
  ): Observable<{
    rewards: CoinBalance[];
    info: { extSLD: BigNumber; rank: BigNumber };
  }> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquiditorRewardsOfPeriod(address, period);
      })
    );
  }

  public getLiquiditorRatingList(period: number): Observable<string[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquiditorRatingList(period);
      })
    );
  }

  //

  public getLiquidityMiningReward(address: string): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquidityMiningReward(address);
      })
    );
  }

  public getLiquidityMiningShare(address: string): Observable<CoinShare[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getLiquidityMiningShare(address);
      })
    );
  }

  public getActiveLiquidityRewards(address: string): Observable<BigNumber> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getActiveLiquidityRewards(address);
      })
    );
  }

  public lockReTokenForLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.lockReTokenForLiquidity(reToken, reTokenAmount);
      })
    );
  }

  public unLockReTokenFromLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.unLockReTokenFromLiquidity(reToken, reTokenAmount);
      })
    );
  }

  public getReTokenLiquidityReward(address: string): Observable<PubPoolRewards> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getReTokenLiquidityReward(address);
      })
    );
  }

  public getPubPoolLiquidityShareInfo(address: string): Observable<PubPoolLockInfo> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getPubPoolLiquidityShareInfo(address);
      })
    );
  }

  public claimRewardsForLP1(): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.claimRewardsForLP1();
      })
    );
  }

  public claimRewardsForLP2(): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.claimRewardsForLP2();
      })
    );
  }

  public getSwapBurnInfo(): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getSwapBurnInfo();
      })
    );
  }

  public doSwap(address: string, coin: IUSDCoins, ddsAmount: number): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.doSwap(address, coin, ddsAmount);
      })
    );
  }

  public getBrokerInfo(address: string): Observable<{ refer: BigNumber; claim: CoinBalance[]; rank: BigNumber }> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getBrokerInfo(address);
      })
    );
  }

  public getBrokerAllCommission(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getBrokerAllCommission(address);
      })
    );
  }

  public getBrokerMonthlyAwardsInfo(address: string): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getBrokerMonthlyAwardsInfo(address);
      })
    );
  }

  public getBrokerMonthlyStartTime(): Observable<number> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getBrokerMonthlyStartTime();
      })
    );
  }

  public getBrokerMonthlyRewardPool(): Observable<CoinBalance[]> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.getBrokerMonthlyRewardPool();
      })
    );
  }

  public doBrokerClaim(): Observable<boolean> {
    return this.accessor.pipe(
      switchMap(accessor => {
        return accessor.doBrokerClaim();
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
