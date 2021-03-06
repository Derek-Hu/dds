import { Component } from 'react';
import CardInfo from '../card-info/index';
import { formatMessage } from 'locale/i18n';
import SiteContext from '../../layouts/SiteContext';

// interface IState {
//   info?: any;
//   loading: boolean;
// }
// @ts-ignore

export default class TradeInfo extends Component<{ from: string; coin: IUSDCoins }, any> {
  state = {
    loading: false,
  };

  render() {
    const { from, coin } = this.props;
    const info = {
      ticketRoot: {
        label: formatMessage({ id: 'ticker-root' }),
        value: `${from}/${coin}`,
      },
      expireData: {
        label: formatMessage({ id: 'expiry-date' }),
        value: formatMessage({ id: 'coin-value-expiry-date-perpetual' }),
      },
      feeRate: {
        label: formatMessage({ id: 'settlements-fee-rate' }),
        value: '1‰',
      },
      liquidityRate: {
        label: formatMessage({ id: 'forced-liquidation-rate' }),
        value: '1%',
      },
      type: {
        label: formatMessage({ id: 'type' }),
        value: formatMessage({ id: 'coin-info-value-type' }),
      },
      exercise: {
        label: formatMessage({ id: 'coin-info-exercise' }),
        value: formatMessage({ id: 'coin-info-value-exercise' }),
      },
    };
    // @ts-ignore
    const items = Object.keys(info).map(key => info[key]);
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div style={{ padding: isMobile ? '0 16px' : '' }}>
            <CardInfo
              isNumber={false}
              loading={false}
              items={items}
              theme="outer"
              title={formatMessage({ id: 'info' })}
            />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
