import { Component } from 'react';
import styles from './base-card.module.less';

type IProps = {};
type IState = {};

export class BaseCard extends Component<IProps, IState> {
  render() {
    const { children } = this.props;
    return <div className={styles.card}>{children}</div>;
  }
}
