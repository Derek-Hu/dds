// address, network, pageIndex, pageSize, PendingOrders
import { EthNetwork } from '../../../constant/network';

export type ListArgs = [string, EthNetwork, number, number];
export type ListArgObject = {
  address: string;
  network: EthNetwork;
  pageIndex: number;
  pageSize: number;
};

export function argConverter(args: ListArgs): ListArgObject {
  return {
    address: args[0],
    network: args[1],
    pageIndex: args[2],
    pageSize: args[3],
  } as ListArgObject;
}
