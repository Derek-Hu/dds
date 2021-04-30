import dayjs from 'dayjs';

// @ts-ignore
const CacheKey = () => window.PendingOrderCacheKey;

export const getPendingOrders = (remoteList?: ITradeRecord[]) => {
  const orders = localStorage.getItem(CacheKey());
  if (!orders) {
    return;
  }
  try {
    const data = JSON.parse(orders);
    if (!Array.isArray(data)) {
      return;
    }
    const now = new Date().getTime();
    const exipred = dayjs(new Date(now)).add(20, 'minute').toDate().getTime();

    data.forEach(item => {
      if (!item.$expireTime) {
        item.$expireTime = exipred;
      }
    });
    if (!remoteList || !remoteList.length) {
      return data;
    }

    const valid = data.filter(item => {
      return (
        item.$expireTime > now &&
        !remoteList.find(remote => {
          return remote.hash === item.hash;
        })
      );
    });

    if (valid.length !== data.length) {
      localStorage.setItem(CacheKey(), JSON.stringify(valid));
    } else {
      localStorage.setItem(CacheKey(), JSON.stringify(data));
    }
    return valid;
  } catch {
    return;
  }
};

export const setPendingOrders = (order: any) => {
  const orders = localStorage.getItem(CacheKey());
  let data;
  try {
    // @ts-ignore
    data = JSON.parse(orders);
  } catch {}
  if (Array.isArray(data)) {
    data.unshift(order);
  } else {
    data = [order];
  }

  localStorage.setItem(CacheKey(), JSON.stringify(data));
};
