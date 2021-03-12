import { Component } from 'react';
import SiteContext from '../../layouts/SiteContext';

export default class Auth extends Component {
  render() {
    return (
      <SiteContext.Consumer>
        {({ account }) => (account && account.address ? this.props.children : null)}
      </SiteContext.Consumer>
    );
  }
}

export class Public extends Component {
  render() {
    return (
      <SiteContext.Consumer>
        {({ account }) => (!account || !account.address ? this.props.children : null)}
      </SiteContext.Consumer>
    );
  }
}
