import { Component } from 'react';
import Header from '../components/header/index';
import ToolBar from '../components/footer/tool-bar';
import SiteContext from './SiteContext';
import ConnectWallet from '../components/connect-wallet/index';
import { withRouter } from 'react-router-dom';
import NetworkSwitch from '../components/network-switch';

const RouteHeader = withRouter(props => <Header {...props} />);

export default class TradeLayout extends Component {
  state = {};

  render() {
    const { children } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div style={isMobile ? { paddingBottom: '50px' } : {}}>
            <RouteHeader />
            {children}
            {isMobile ? <ToolBar /> : null}

            <ConnectWallet />
            <NetworkSwitch />
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
