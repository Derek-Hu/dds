const CacheKey = 'PendingOrdersHash';
export const getPendingOrders = (remoteList?: ITradeRecord[]) => {
  const orders = localStorage.getItem(CacheKey);
  if (!orders) {
    return;
  }
  try {
    const data = JSON.parse(orders);
    if (!Array.isArray(data)) {
      return;
    }
    if (!remoteList || !remoteList.length) {
      return data;
    }
    const valid = data.filter(item => {
      return !remoteList.find(remote => remote.hash === item.hash);
    });

    if (valid.length !== data.length) {
      JSON.stringify(valid);
    }
    localStorage.setItem(CacheKey, JSON.stringify(valid));
    return valid;
  } catch {
    return;
  }
};

export const setPendingOrders = (order: any) => {
  const orders = localStorage.getItem(CacheKey);
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

  localStorage.setItem(CacheKey, JSON.stringify(data));
};
