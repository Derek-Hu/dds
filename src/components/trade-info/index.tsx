import { Component } from 'react';
import { getTradeInfo } from '../../services/trade.service';
import CardInfo from '../card-info/index';

// interface IState {
//   info?: any;
//   loading: boolean;
// }
// @ts-ignore

export default class TradeInfo extends Component<{ from: string; coin: IUSDCoins }, any> {
  state = {
    loading: false,
  };

  //   async componentDidMount() {
  //     const { coin } = this.props;
  //     this.setState({
  //       loading: true,
  //     });
  //     try {
  //       const info = await getTradeInfo(coin);
  //       this.setState({
  //         info,
  //       });
  //     } catch {}
  //     this.setState({
  //       loading: false,
  //     });
  //   }

  render() {
    const { from, coin } = this.props;
    const info = {
      ticketRoot: {
        label: 'Ticker Root',
        value: `${from}/${coin}`,
      },
      expireData: {
        label: 'Expiry Date',
        value: 'Perpetual',
      },
      feeRate: {
        label: 'Settlements Fee Rate',
        value: '1‰',
      },
      liquidityRate: {
        label: 'Forced Liquidation Rate',
        value: '2%',
      },
      type: {
        label: 'Type',
        value: 'Risk Perpetual',
      },
      exercise: {
        label: 'Exercise',
        value: 'Manually',
      },
    };
    // @ts-ignore
    const items = Object.keys(info).map((key) => info[key]);
    return <CardInfo loading={false} items={items} theme="outer" title="Info" />;
  }
}
