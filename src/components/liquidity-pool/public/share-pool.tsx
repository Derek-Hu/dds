import { Component } from 'react';
import { formatMessage } from 'locale/i18n';
import { getUserReTokenShareInPubPool } from '../../../services/pool.service';
import CoinProgress from '../../card-info/coin-progress';

export default class PoolArea extends Component {
  render() {
    // const dataInfo = (data || []).reduce((total, item) => {
    //   // @ts-ignore
    //   total[item.label] = item.value;
    //   return total;
    // }, {});

    // // @ts-ignore
    // const coins = Object.keys(SupporttedUSD).map((coin) => ({
    //   label: coin,
    //   // @ts-ignore
    //   value: dataInfo[coin],
    // }));
    return (
      <CoinProgress
        totalMode={true}
        service={getUserReTokenShareInPubPool}
        title={formatMessage({ id: 'your-share-in-the-pool' })}
      />
    );
    // return (
    //   <div>
    //     <PoolProgress loading={loading} totalMode={true} title="Your Share in the Pool" coins={data} />
    //   </div>
    // );
  }
}
