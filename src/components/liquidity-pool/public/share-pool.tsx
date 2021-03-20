import { Component } from 'react';
import { getCollaborativeShareInPool } from '../../../services/pool.service';
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
    return <CoinProgress totalMode={true} service={getCollaborativeShareInPool} title="Your Share in the Pool" />;
    // return (
    //   <div>
    //     <PoolProgress loading={loading} totalMode={true} title="Your Share in the Pool" coins={data} />
    //   </div>
    // );
  }
}
