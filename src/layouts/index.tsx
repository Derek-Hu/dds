import { Component } from 'react';
import HomeLayout from '../layouts/home.layout';
import TradeLayout from '../layouts/trade.layout';
import { RouteComponentProps } from 'react-router-dom';
import SiteContext from './SiteContext';

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
  account: string;
}
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = { isMobile: false, account: '' };

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

  updateAccount = (account: string) => {
    this.setState({
      account,
    });
  };
  render() {
    const { children, location } = this.props;
    const { isMobile, account } = this.state;
    const LayoutComp = location.pathname === '/home' ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider
        value={{
          updateAccount: this.updateAccount,
          isMobile,
          direction: 'ltr',
          account: process.env.NODE_ENV === 'development' ? '0x3232' : account,
        }}
      >
        <div className={isMobile ? 'mobile' : ''}>
          <LayoutComp>{children}</LayoutComp>
        </div>
      </SiteContext.Provider>
    );
  }
}
