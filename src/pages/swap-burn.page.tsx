import { Component } from 'react';
import SwapBurn from '../components/swap-burn/index';
import SiteContext from '../layouts/SiteContext';
export default class SwapBurnPage extends Component {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          return (
            <div>
              <SwapBurn isLogin={!!account} />
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
