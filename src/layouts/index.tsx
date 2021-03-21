import { Component } from 'react';
import HomeLayout from '../layouts/home.layout';
import TradeLayout from '../layouts/trade.layout';
import { RouteComponentProps } from 'react-router-dom';
import SiteContext from './SiteContext';

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
  account: IAccount | null;
  address: string;
}
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = { isMobile: false, address: '', account: null };

  componentDidMount() {
    this.updateMobileMode();
    window.addEventListener('resize', this.updateMobileMode);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMobileMode);
  }

  updateMobileMode = () => {
    const { isMobile } = this.state;
    const newIsMobile = window.innerWidth < RESPONSIVE_MOBILE;
    if (isMobile !== newIsMobile) {
      this.setState({
        isMobile: newIsMobile,
      });
    }
  };

  updateAccount = (account: IAccount) => {
    this.setState({
      account,
      address: account && account.address ? account.address : '',
    });
  };
  render() {
    const { children, location } = this.props;
    const { isMobile, account, address } = this.state;
    const LayoutComp = location.pathname === '/home' ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider
        value={{
          updateAccount: this.updateAccount,
          isMobile,
          direction: 'ltr',
          account:
            process.env.NODE_ENV === 'development'
              ? {
                  address: '0x839423432432',
                  USDBalance: {
                    USDT: 234232432,
                    USDC: 43243232,
                    DAI: 23890230432,
                  },
                }
              : account,
          address: process.env.NODE_ENV === 'development' ? '0x839423432432' : address,
        }}
      >
        <div className={isMobile ? 'mobile' : ''}>
          <LayoutComp>{children}</LayoutComp>
        </div>
      </SiteContext.Provider>
    );
  }
}
