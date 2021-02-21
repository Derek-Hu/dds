import { ABI, ContractProxy } from '~/wallet/contract-interface';
import { BehaviorSubject, from, Observable, of, interval } from 'rxjs';
import * as ethers from 'ethers';
import { map, startWith, switchMap } from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import { toEthers } from '../util/ethers';
import { isMetaMaskInstalled } from './metamask';
import { ContractAddress, DataRefreshInterval, DefaultNetwork, Wallet } from '~/constant';
import { chainDataState, ChainDataState } from '~/wallet/chain-state';

declare const window: Window & { ethereum: any };

abstract class BaseContractAccessor implements ContractProxy {
  protected contract: ethers.Contract | null = null;
  protected timer = interval(DataRefreshInterval).pipe(startWith(0));

  constructor() {
    this.contract = this.getContract();
  }

  public getPriceByETHDAI(): Observable<string> {
    if (this.contract) {
      return from(this.contract.functions.getPriceByETHDAI()).pipe(
        map((num: BigNumber) => {
          return toEthers(num, 4);
        })
      );
    } else {
      return of('');
    }
  }

  public watchPriceByETHDAI(): Observable<string> {
    return this.timer.pipe(
      switchMap(() => {
        return this.getPriceByETHDAI();
      })
    );
  }

  protected abstract getContract(): ethers.Contract | null;
}

/**
 * 当没有metamask时，默认的网络连接
 */
class DefaultContractAccessor extends BaseContractAccessor {
  protected getContract(): ethers.Contract | null {
    const provider = ethers.getDefaultProvider(DefaultNetwork);
    return new ethers.Contract(ContractAddress, ABI, provider);
  }
}

/**
 * 通过Metamask访问network
 */
class MetamaskContractAccessor extends BaseContractAccessor {
  protected getContract(): ethers.Contract | null {
    if (!isMetaMaskInstalled()) {
      return null;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    return new ethers.Contract(ContractAddress, ABI, provider);
  }
}

/**
 *
 */
export class ContractAccessor implements ContractProxy {
  private readonly chainData: ChainDataState = chainDataState;
  private readonly defaultAccessor = new DefaultContractAccessor();
  private readonly metamaskAccessor = new MetamaskContractAccessor();
  private readonly accessor: BehaviorSubject<BaseContractAccessor> = new BehaviorSubject<BaseContractAccessor>(
    new DefaultContractAccessor()
  );

  constructor() {
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

  getPriceByETHDAI(): Observable<string> {
    return this.accessor.getValue().getPriceByETHDAI();
  }

  watchPriceByETHDAI(): Observable<string> {
    return this.accessor.pipe(
      switchMap((accessor: BaseContractAccessor) => {
        return accessor.watchPriceByETHDAI();
      })
    );
  }
}

export const contractAccessor = new ContractAccessor();
