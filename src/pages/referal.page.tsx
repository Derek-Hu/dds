import { Component } from 'react';
import CryptoJS from 'crypto-js';

export default class PoolPage extends Component<any, any> {
  componentDidMount() {
    // @ts-ignore
    console.log(this.props.location.search);

    try {
      const code = this.props.location.search.replace(/^\?code=/, '');
      // Decrypt
      const bytes = CryptoJS.AES.decrypt(code, '0x');
      const referalCode = '0x' + bytes.toString(CryptoJS.enc.Utf8);
      localStorage.setItem('referalCode', referalCode);
    } catch {}

    this.props.history.replace({ pathname: '/trade' });
  }

  render() {
    return null;
  }
}
