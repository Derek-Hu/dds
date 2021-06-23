import dayjs from 'dayjs';
import { getOrderListStatus } from '../services/trade.service';
import { tap } from 'rxjs/operators';
import { message } from 'antd';
import { orderTips } from '../components/trade-bonus/trade-tips';
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
      return !remoteList.find(remote => {
        return remote.hash === item.hash;
      });
    });

    if (valid.length !== data.length) {
      localStorage.setItem(CacheKey(), JSON.stringify(valid));
    } else {
      localStorage.setItem(CacheKey(), JSON.stringify(data));
    }

    // -- begin 检查order最终状态 - 异步执行
    const hashArr = valid.map(item => item.hash);
    getOrderListStatus(hashArr)
      .pipe(
        tap(statusArr => {
          const failHash: string[] = statusArr.filter(status => status.status === 'fail').map(status => status.hash);
          if (failHash.length > 0) {
            const newCache = valid.filter(item => failHash.indexOf(item.hash) < 0);
            localStorage.setItem(CacheKey(), JSON.stringify(newCache));

            // 通知显示失败的order
            message.info(orderTips(failHash));
          }
        })
      )
      .subscribe();
    // -- end

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
