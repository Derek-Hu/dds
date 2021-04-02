import { v4 as uuidv4 } from 'uuid';

export const getPendingOrders = (timestamp: number) => {
  const orders = localStorage.getItem('PendingOrders');
  if (!orders) {
    return;
  }
  try {
    const data = JSON.parse(orders);
    if (!Array.isArray(data)) {
      return;
    }
    const valid = data.filter(item => {
      return item.time > timestamp;
    });
    if (valid.length !== data.length) {
      localStorage.setItem('PendingOrders', JSON.stringify(data));
    }
    return valid;
  } catch {
    return;
  }
};

export const setPendingOrders = (order: any) => {
  order.id = uuidv4();
  const orders = localStorage.getItem('PendingOrders');
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

  localStorage.setItem('PendingOrders', JSON.stringify(data));
};
