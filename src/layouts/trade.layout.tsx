  
import { Component } from 'react';
import Header from '../components/header/index';
import ToolBar from '../components/footer/tool-bar';
import SiteContext from "./SiteContext";
import ConnectWallet from '../components/connect-wallet/index';

export default class TradeLayout extends Component {

  state = {
    // @ts-ignore
    connectVisible: !window.ethereum
  }
  componentDidMount(){
  }

  render() {
    const { children } = this.props;
    const { connectVisible } = this.state;
    return <SiteContext.Consumer>
    {({ isMobile }) => (
      <div style={isMobile ? {paddingBottom: '50px'}: {}}>
        <Header/>
        {
          children
        }
        { isMobile ? <ToolBar /> : null}

        <ConnectWallet noEnv={connectVisible}></ConnectWallet>
      </div>
    )}
    </SiteContext.Consumer>
  }
}
