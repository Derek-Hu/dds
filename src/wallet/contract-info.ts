import { BIAN_TEST_ADDRESS, ContractAddress, KOVAN_ADDRESS } from '../constant/address';
import { ContractInfo } from './contract-interface';
import { BN_ABI, ETH_ABI } from './abi';
import { EthNetwork } from '../constant/network';

export function getContractInfo(network: EthNetwork, contract: keyof ContractAddress): ContractInfo {
  const abi = getContractABI(network, contract);
  const address = getContractAddress(network, contract);

  return { abi, address };
}

export function getContractABI(network: EthNetwork, contract: keyof ContractAddress): any[] {
  switch (network) {
    case EthNetwork.kovan: {
      return ETH_ABI[contract];
    }
    case EthNetwork.bianTest: {
      return BN_ABI[contract];
    }
    default: {
      return [];
    }
  }
}

export function getContractAddress(network: EthNetwork, contract: keyof ContractAddress): string {
  switch (network) {
    case EthNetwork.kovan: {
      return KOVAN_ADDRESS[contract];
    }
    case EthNetwork.bianTest: {
      return BIAN_TEST_ADDRESS[contract];
    }
    default: {
      return '';
    }
  }
}
