import { Observable } from 'rxjs';

export const ABI = [
  'function getPriceByETHDAI() external view returns(uint256)',
];

export interface ContractProxy {
  getPriceByETHDAI(): Observable<string>;

  watchPriceByETHDAI(): Observable<string>;
}
