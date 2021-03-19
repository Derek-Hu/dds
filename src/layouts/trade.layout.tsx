  
import { Component } from 'react';
import Header from '../components/header/index';
import ToolBar from '../components/footer/tool-bar';
import SiteContext from "./SiteContext";
import ConnectWallet from '../components/connect-wallet/index';

export default class TradeLayout extends Component {

  state = {
  }
  componentDidMount(){
  }

  render() {
    const { children } = this.props;
    return <SiteContext.Consumer>
    {({ isMobile }) => (
      <div style={isMobile ? {paddingBottom: '50px'}: {}}>
        <Header/>
        {
          children
        }
        { isMobile ? <ToolBar /> : null}

        <ConnectWallet></ConnectWallet>
      </div>
    )}
    </SiteContext.Consumer>
  }
}
