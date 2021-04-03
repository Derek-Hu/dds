import { Component } from 'react';
import HomeLayout from '../layouts/home.layout';
import TradeLayout from '../layouts/trade.layout';
import { RouteComponentProps } from 'react-router-dom';
import SiteContext from './SiteContext';
import { ddsBasePath } from '../constant/index';
import { userAccountInfo, initTryConnect } from '../services/account';

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
  account: IAccount | null;
  address: string;
  connected: boolean | null;
  timestamp: number | null;
}
// @ts-ignore
let timer = null;

const isDDSPage = window.location.href.indexOf(ddsBasePath) === 0;
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = { connected: null, timestamp: null, isMobile: false, address: '', account: null };

  constructor(props: any) {
    super(props);
    // @ts-ignore
    window.globalRefresh = this.refreshPage;
  }
  componentDidMount() {
    if (isDDSPage) {
      this.tick();
      this.connectTimeout();
    }
    this.updateMobileMode();
    window.addEventListener('resize', this.updateMobileMode);
  }

  connectTimeout = () => {
    setTimeout(() => {
      const { connected } = this.state;
      if (connected === null) {
        this.setState({
          connected: false,
        });
      }
    }, 4000);
  };

  tick = async () => {
    const isConnected = await initTryConnect();
    const { connected } = this.state;

    if (isConnected !== connected) {
      this.setState({
        connected: isConnected,
      });
      if (!isConnected) {
        this.updateAccount(null);
      }else{
        this.refreshPage();
      }
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

  refreshPage = () => {
    this.setState({
      timestamp: new Date().getTime(),
    });
  };
  render() {
    const { children, location } = this.props;
    const { isMobile, account, address, timestamp, connected } = this.state;
    const LayoutComp = location.pathname === '/home' ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider
        value={{
          updateAccount: this.updateAccount,
          refreshPage: this.refreshPage,
          isMobile,
          connected,
          direction: 'ltr',
          // @ts-ignore
          timestamp,
          account,
          address,
          // account:
          //   process.env.NODE_ENV === 'development'
          //     ? {
          //         address: '0x839423432432',
          //         USDBalance: {
          //           USDT: 100.32432,
          //           USDC: 200.32432,
          //           DAI: 300.3213,
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
