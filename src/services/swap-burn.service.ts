import Mask from '../components/mask';

const returnVal: any = (val: any): Parameters<typeof returnVal>[0] => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, Math.random() * 2000);
  });
};

export const getSwapPrice = async (): Promise<ISwapBurn> => {
  const usd = Math.random() * 100010001000;
  const dds = Math.random() * 100010001000;

  return returnVal({
    usd,
    dds,
    rate: dds/usd,
  });
};

export const conformSwap = async (data: any): Promise<boolean> => {
  Mask.showLoading();
  const isSuccess = await returnVal(false);
  if(isSuccess){
    Mask.showSuccess();
  }else{
    Mask.showFail();
  }
  return isSuccess;
};

