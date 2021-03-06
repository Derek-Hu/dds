import { Component } from 'react';
import PoolProgress from '../progress-bar/pool-progress';
import { Hidden } from '../builtin/hidden';
import { IIndicatorProgress } from '../progress-bar/with-indicator';
import { dividedPecent, format } from '../../util/math';
import { SupporttedUSD, DefaultProgressDatas } from '../../constant/index';

interface IState {
  data: IIndicatorProgress[] | ICoinProgressObj;
  loading: boolean;
}

interface IProps {
  title: string;
  service: () => Promise<ICoinItem[]>;
  children?: any;
  desc?: any;
  totalMode: boolean;
}

export default class CoinProgress extends Component<IProps, IState> {
  state: IState = {
    data: { ...DefaultProgressDatas },
    loading: false,
  };

  async componentDidMount() {
    this.loadData();
  }
  UNSAFE_componentWillReceiveProps() {
    this.loadData();
  }

  async loadData() {
    const { service } = this.props;

    this.setState({ loading: true });

    const data = await service();
    this.setState({
      data: data
        ? data.map(({ amount, total, coin }) => ({
            label: coin,
            percentage: dividedPecent(amount, total),
            val: (
              <span>
                {format(amount)} / {format(total)}
              </span>
            ),
          }))
        : [],
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { children, desc, title, totalMode } = this.props;
    return (
      <div>
        <PoolProgress loading={loading} totalMode={totalMode} desc={desc} title={title} coins={data}>
          {children}
        </PoolProgress>
      </div>
    );
  }
}
