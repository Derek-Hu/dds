import Mask from '../components/mask/index';

export const withLoading = (promiseInstance: Promise<boolean>) => {
  return promiseInstance
    .then((rs: boolean) => {
      if (rs) {
        Mask.showSuccess();
      } else {
        Mask.showFail();
      }
      return rs;
    })
    .catch((err) => {
      console.log(err);
      Mask.showFail();
      return false;
    });
};
