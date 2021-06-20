import { Component } from 'react';
import SiteContext from '../../../layouts/SiteContext';
import { BaseCard } from './base-card';
import styles from './secondary-card.module.less';

type IProps = {
  title: string;
};
type IState = {};

export class SecondaryCard extends Component<IProps, IState> {
  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <BaseCard>
            <h2 className={styles.title}>{this.props.title}</h2>
            <div>{this.props.children}</div>
          </BaseCard>
        )}
      </SiteContext.Consumer>
    );
  }
}
