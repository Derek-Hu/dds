import { BSC_ADDRESS, ContractAddress, ContractAddressByNetwork } from '../../constant/address';
import { NEVER, Observable } from 'rxjs';
import { walletState } from '../wallet/wallet-state';
import { map, switchMap } from 'rxjs/operators';
import { EthNetwork } from '../../constant/network';
import { Contract } from 'ethers';
import { ContractABIByNetwork } from '../../wallet/abi';
import { contractAccessor } from '../../wallet/chain-access';
import { TOKEN_SYMBOL } from '../../constant/tokens';
import { P } from '../page/page-state-parser';
import { PageTradingPair } from '../state-types';

type ContractObsMap = { [p in keyof ContractAddress]: Observable<Contract> };
type ContractName = keyof ContractAddress;

export class ConstState {
  public readonly CONTRACTS: ContractObsMap;
  public readonly TradeOptionContract: Observable<Contract>;
  public readonly DepositERC20Contract: Observable<Contract>;
  public readonly TradePubPoolContract: Observable<Contract>;
  public readonly TradePriPoolContract: Observable<Contract>;

  constructor() {
    this.CONTRACTS = Array.from(Object.keys(BSC_ADDRESS) as ContractName[]).reduce(
      (acc: ContractObsMap, name: ContractName): ContractObsMap => {
        acc[name] = this.watchContract(name);
        return acc;
      },
      {} as ContractObsMap
    );

    this.DepositERC20Contract = P.Trade.Pair.watch().pipe(
      switchMap((pair: PageTradingPair) => {
        switch (pair.quote) {
          case TOKEN_SYMBOL.DAI: {
            return this.CONTRACTS.ERC20DAI;
          }
          case TOKEN_SYMBOL.USDT: {
            return this.CONTRACTS.ERC20USDT;
          }
          case TOKEN_SYMBOL.USDC: {
            return this.CONTRACTS.ERC20USDC;
          }
          default: {
            return NEVER;
          }
        }
      })
    );

    this.TradeOptionContract = P.Trade.Pair.watch().pipe(
      switchMap((pair: PageTradingPair) => {
        switch (pair.quote) {
          case TOKEN_SYMBOL.DAI: {
            return this.CONTRACTS.TradeDAIContract;
          }
          case TOKEN_SYMBOL.USDT: {
            return this.CONTRACTS.TradeUSDTContract;
          }
          case TOKEN_SYMBOL.USDC: {
            return this.CONTRACTS.TradeUSDCContract;
          }
          default: {
            return NEVER;
          }
        }
      })
    );

    this.TradePriPoolContract = P.Trade.Pair.watch().pipe(
      switchMap((pair: PageTradingPair) => {
        switch (pair.quote) {
          case TOKEN_SYMBOL.DAI: {
            return this.CONTRACTS.Lp2DAIContract;
          }
          case TOKEN_SYMBOL.USDT: {
            return this.CONTRACTS.Lp2USDTContract;
          }
          case TOKEN_SYMBOL.USDC: {
            return this.CONTRACTS.Lp2USDCContract;
          }
          default: {
            return NEVER;
          }
        }
      })
    );

    this.TradePubPoolContract = P.Trade.Pair.watch().pipe(
      switchMap((pair: PageTradingPair) => {
        switch (pair.quote) {
          case TOKEN_SYMBOL.DAI: {
            return this.CONTRACTS.Lp1DAIContract;
          }
          case TOKEN_SYMBOL.USDT: {
            return this.CONTRACTS.Lp1USDTContract;
          }
          case TOKEN_SYMBOL.USDC: {
            return this.CONTRACTS.Lp1USDCContract;
          }
          default: {
            return NEVER;
          }
        }
      })
    );
  }

  /**
   * Get the specified contract address while network changed.
   * @param contractName - the name of contract
   */
  public watchContractAddress(contractName: keyof ContractAddress): Observable<{ abi: any[]; address: string }> {
    return walletState.watchNetwork().pipe(
      map((network: EthNetwork) => {
        const address: string = ContractAddressByNetwork[network][contractName];
        const abi: any[] = ContractABIByNetwork[network][contractName];

        return { address, abi };
      })
    );
  }

  /**
   *
   * @param contractName
   */
  public watchContract(contractName: keyof ContractAddress): Observable<Contract> {
    return this.watchContractAddress(contractName).pipe(
      switchMap(({ abi, address }) => {
        return contractAccessor.createAContract(abi, address);
      })
    );
  }
}

export const constState = new ConstState();
