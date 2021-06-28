import { from, Observable, of } from 'rxjs';
import { loginUserAccount } from './account';
import { catchError, map, switchMap } from 'rxjs/operators';
import { contractAccessor } from '../wallet/chain-access';
import { BigNumber } from 'ethers';
import { toEthers } from '../util/ethers';

export function airdropAvailable(): Observable<number> {
  return from(loginUserAccount()).pipe(
    switchMap(account => {
      return contractAccessor.airDropWhiteList(account);
    }),
    map((amount: BigNumber) => {
      return Number(toEthers(amount, 4, 'SLD'));
    }),
    catchError(err => {
      console.warn('error', err);
      return of(0);
    })
  );
}
