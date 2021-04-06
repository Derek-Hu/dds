import Mask from '../components/mask/index';

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
      console.log(err);
      Mask.showFail();
      return (fallback === undefined ? false : fallback) as T;
    });
};
