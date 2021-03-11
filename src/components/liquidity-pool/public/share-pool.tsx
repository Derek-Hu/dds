import { Component } from 'react';
import PoolProgress from '../../progress-bar/pool-progress';
import { getCollaborativeShareInPool } from '../../../services/pool.service';
import { dividedPecent, format } from '../../../util/math';
import { IIndicatorProgress } from "../../progress-bar/with-indicator";

interface IState {
  data: IIndicatorProgress[];
  loading: boolean;
}
export default class PoolArea extends Component<{ address?: string }, IState> {

  state:IState = {
    data: [],
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
          val: <span>{format(amount)}/ {format(total)}</span>,
        }))
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  render(){
    const { data, loading } = this.state;
    return loading ? null : <div>
        <PoolProgress 
          totalMode={true}
          title="Your Share in the Pool" 
          coins={data}
          />
      </div>
  }
}
