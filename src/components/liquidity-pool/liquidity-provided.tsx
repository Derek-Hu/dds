import SiteContext from '../../layouts/SiteContext';
import { Component } from 'react';
import Pool from './pool';
import { getCollaborativeLiquidityProvided } from '../../services/pool.service';
import { formatMessage } from '~/util/i18n';

interface IState {
  data: Array<{ label: string; value: number }>;
  loading: boolean;
}
interface IProps {}
export default class LiquidityProvided extends Component<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const data = await getCollaborativeLiquidityProvided();
      this.setState({
        data: data ? data.map(({ coin, value }) => ({ label: coin as string, value: value })) : [],
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  render() {
    const { data } = this.state;
    return (
      <SiteContext.Consumer>
        {() => <Pool title={formatMessage({ id: 'liquidity-provided' })} coins={data} />}
      </SiteContext.Consumer>
    );
  }
}
