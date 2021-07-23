import CardInfo from '../card-info/index';
import { formatMessage } from 'locale/i18n';
import SiteContext from '../../layouts/SiteContext';
import { PageTradingPair } from '../../state-manager/state-types';
import { P } from '../../state-manager/page/page-state-parser';
import { BaseStateComponent } from '../../state-manager/base-state-component';

type IState = {
  tradingPair: PageTradingPair;
};

export default class TradeInfo extends BaseStateComponent<{}, IState> {
  state: IState = {
    tradingPair: P.Trade.Pair.get(),
  };

  componentDidMount() {
    this.registerState('tradingPair', P.Trade.Pair);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  render() {
    const info = {
      ticketRoot: {
        label: formatMessage({ id: 'ticker-root' }),
        value: `${this.state.tradingPair.base.description}/${this.state.tradingPair.quote.description}`,
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
