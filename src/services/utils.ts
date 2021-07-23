import Mask from '../components/mask/index';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const withLoading = <T = boolean>(promiseInstance: Promise<T>, fallback?: T): Promise<T> => {
  Mask.showLoading();
  return promiseInstance
    .then((rs: T) => {
      if (rs) {
        Mask.showSuccess();
      } else {
        Mask.showFail();
      }
      return rs;
    })
    .catch(err => {
      console.warn(err);
      Mask.showFail();
      return (fallback === undefined ? false : fallback) as T;
    });
};

export const loadingObs = (
  obs: Observable<boolean>,
  failText: string | null = null,
  pendingText: string | null = null,
  sucHide: boolean = false
): Observable<boolean> => {
  Mask.showLoading(pendingText);
  return obs.pipe(
    tap((done: boolean) => {
      if (done) {
        if (sucHide) {
          Mask.hide();
        } else {
          Mask.showSuccess();
        }
      } else {
        Mask.showFail(failText);
      }
    })
  );
};
