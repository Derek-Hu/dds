import { Component } from 'react';
import PoolProgress from '../../progress-bar/pool-progress';
import { getCollaborativeShareInPool } from '../../../services/pool.service';
import { dividedPecent, format } from '../../../util/math';
import { IIndicatorProgress } from '../../progress-bar/with-indicator';
import { SupporttedUSD, DefaultProgressDatas } from '../../../constant/index';
import CoinProgress from '../../card-info/coin-progress';

interface IState {
  data: IIndicatorProgress[] | ICoinProgressObj;
  loading: boolean;
}
export default class PoolArea extends Component<{ address?: string }, IState> {
  state: IState = {
    data: {
      ...DefaultProgressDatas
    },
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const data = await getCollaborativeShareInPool();
      this.setState({
        data: data.map(({ amount, total, coin }) => ({
          label: coin,
          percentage: dividedPecent(amount, total),
          val: (
            <span>
              {format(amount)}/ {format(total)}
            </span>
          ),
        })),
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;

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
