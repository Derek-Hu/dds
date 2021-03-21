import { Component } from 'react';
import HomeLayout from '../layouts/home.layout';
import TradeLayout from '../layouts/trade.layout';
import { RouteComponentProps } from 'react-router-dom';
import SiteContext from './SiteContext';
import { userAccountInfo, initTryConnect } from '../services/account';
import { clearTimeout } from 'timers';

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
  account: IAccount | null;
  address: string;
  connected: boolean | null;
}
// @ts-ignore
let timer = null;
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = { connected: null, isMobile: false, address: '', account: null };

  componentDidMount() {
    this.tick();
    this.updateMobileMode();
    window.addEventListener('resize', this.updateMobileMode);
  }

  tick = async () => {
    const isConnected = await initTryConnect();
    const { connected } = this.state;

    if (isConnected !== connected) {
      this.setState({
        connected,
      });
    }

    if (!connected) {
      this.updateAccount(null);
    }

    // @ts-ignore
    timer = setTimeout(() => {
      this.tick();
    }, 5000);
  };
  componentWillUnmount() {
    // @ts-ignore
    if (timer) {
      // @ts-ignore
      clearTimeout(timer);
    }
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
    const { isMobile, account, address, connected } = this.state;
    const LayoutComp = location.pathname === '/home' ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider
        value={{
          updateAccount: this.updateAccount,
          isMobile,
          connected,
          direction: 'ltr',
          account,
          address,
          // account:
          //   process.env.NODE_ENV === 'development'
          //     ? {
          //         address: '0x839423432432',
          //         USDBalance: {
          //           USDT: 234232432.32432,
          //           USDC: 43243232.32432,
          //           DAI: 23890230432.3213,
          //         },
          //       }
          //     : account,
          // address: process.env.NODE_ENV === 'development' ? '0x839423432432' : address,
        }}
      >
        <div className={isMobile ? 'mobile' : ''}>
          <LayoutComp>{children}</LayoutComp>
        </div>
      </SiteContext.Provider>
    );
  }
}
