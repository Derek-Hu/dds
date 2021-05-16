import { Component } from 'react';
import HomeLayout from '../layouts/home.layout';
import TradeLayout from '../layouts/trade.layout';
import { RouteComponentProps } from 'react-router-dom';
import SiteContext from './SiteContext';
import { ddsBasePath, DefaultKeNetwork } from '../constant/index';
import { userAccountInfo, initTryConnect, getNetworkAndAccount } from '../services/account';
import { walletManager } from '../wallet/wallet-manager';
import { CentralPath, EthNetwork } from '../constant/address';
import { accountEvents } from '../services/global-event.service';
import { Subscription } from 'rxjs';

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
  account: IAccount | null;
  address: string;
  connected: boolean | null;
  timestamp: number | null;
  currentNetwork: INetworkKey;
}

// @ts-ignore
let timer = null;

const isDDSPage = window.location.href.indexOf(ddsBasePath) === 0;
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = {
    currentNetwork: DefaultKeNetwork,
    connected: null,
    timestamp: null,
    isMobile: false,
    address: '',
    account: null,
  };

  private eventSub: Subscription | undefined;

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

    this.eventSub = accountEvents.watchAccountEvent().subscribe(() => {
      if (this.state.connected) {
        this.refreshPage();
      }
    });
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

  reloadBalance = async () => {
    try {
      // @ts-ignore
      const account: IAccount = await Promise.race([
        userAccountInfo(),
        new Promise(resolve => {
          setTimeout(() => {
            resolve(null);
          }, 2000);
        }),
      ]);
      if (account) {
        this.updateAccount(account);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  switNetwork = async (currentNetwork: INetworkKey) => {
    const { address } = this.state;
    // @ts-ignore
    const networkCode: EthNetwork = Object.keys(CentralPath).find(v => CentralPath[v as EthNetwork] === currentNetwork);
    const switched = await getNetworkAndAccount({
      network: networkCode,
      account: address,
    });
    this.setState({
      currentNetwork,
    });
    await this.refreshPage();
  };
  tick = async () => {
    // let isConnected = null;
    // let hasError = false;
    try {
      const isConnected = await initTryConnect();
      const { connected, account } = this.state;
      if (isConnected !== connected || (connected === true && !account)) {
        this.setState({
          connected: isConnected,
        });
        if (!isConnected) {
          this.updateAccount(null);
        } else {
          this.reloadBalance();
        }
      }
    } catch (e) {
      // hasError = true;
      // console.log(e);
      // if (e.code === 32002) {
      //   // waiting
      // }
      if (e.code === 4001) {
        // reject
        return;
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

    if (this.eventSub) {
      this.eventSub.unsubscribe();
      this.eventSub = undefined;
    }
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
    const networkCode = account?.network;
    // @ts-ignore
    const network = CentralPath[networkCode] || DefaultKeNetwork;
    this.setState({
      account,
      // @ts-ignore
      currentNetwork: network,
      address: account && account.address ? account.address : '',
    });
    // @ts-ignore
    window.PendingOrderCacheKey = `PendingOrdersHash-${account?.address}-${network}`;
  };

  refreshPage = () => {
    this.reloadBalance();
    this.setState({
      timestamp: new Date().getTime(),
    });
  };

  render() {
    const { children, location } = this.props;
    const { isMobile, account, address, currentNetwork, timestamp, connected } = this.state;
    const LayoutComp = location.pathname === '/home' ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider
        value={{
          updateAccount: this.updateAccount,
          refreshPage: this.refreshPage,
          switNetwork: this.switNetwork,
          isMobile,
          connected,
          currentNetwork,
          isBSC: currentNetwork === 'bscmain' || currentNetwork === 'bsctest',
          // isBSC: process.env.NODE_ENV === 'development' ? true: currentNetwork === 'bscmain' || currentNetwork === 'bsctest',
          direction: 'ltr',
          // @ts-ignore
          timestamp,
          account,
          address,
          // account:
          //   process.env.NODE_ENV === 'development'
          //     ? {
          //         address: '0x839423432432',
          //         network: 'kovan',
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
