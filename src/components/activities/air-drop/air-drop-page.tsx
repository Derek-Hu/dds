import { Component } from 'react';
import styles from './air-drop-page.module.less';

type IProps = {};
type IState = {};

export default class AirDropPage extends Component<IProps, IState> {
  render() {
    return <div className={styles.bodyWrapper}>Airdrop Page</div>;
  }
}
