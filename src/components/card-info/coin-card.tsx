import { Component } from 'react';
import CardInfo from '../card-info/index';
import { Hidden } from '../builtin/hidden';

interface IState {
  data: Array<{ label: string; value: any }>;
  loading: boolean;
}

interface IProps {
  title: string;
  service: () => Promise<Array<{ coin: string; value: number }>>;
  children?: any;
  theme: 'outer' | 'inner';
}

export default class CoinCard extends Component<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
  };

  async componentDidMount() {
    const { service } = this.props;

    this.setState({ loading: true });

    const data = await service();
    this.setState({
      data: data.map(({ value, coin }) => ({
        label: coin,
        value,
      })),
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { children, theme, title } = this.props;
    return (
        <div>
          <CardInfo loading={loading} theme={theme} title={title} items={data}>
            {children}
          </CardInfo>
        </div>
    );
  }
}
