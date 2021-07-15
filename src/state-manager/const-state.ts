import { BSC_ADDRESS, ContractAddress, ContractAddressByNetwork } from '../constant/address';
import { NEVER, Observable } from 'rxjs';
import { walletState } from './wallet-state';
import { map, switchMap } from 'rxjs/operators';
import { EthNetwork } from '../constant/network';
import { Contract } from 'ethers';
import { ContractABIByNetwork } from '../wallet/abi';
import { contractAccessor } from '../wallet/chain-access';
import { PageTradingPair } from './page-state-types';
import { TOKEN_SYMBOL } from '../constant/tokens';
import { P } from './page-state-parser';

type ContractObsMap = { [p in keyof ContractAddress]: Observable<Contract> };
type ContractName = keyof ContractAddress;

export class ConstState {
  public readonly CONTRACTS: ContractObsMap;
  public readonly TradeOptionContract: Observable<Contract>;

  constructor() {
    this.CONTRACTS = Array.from(Object.keys(BSC_ADDRESS) as ContractName[]).reduce(
      (acc: ContractObsMap, name: ContractName): ContractObsMap => {
        acc[name] = this.watchContract(name);
        return acc;
      },
      {} as ContractObsMap
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
