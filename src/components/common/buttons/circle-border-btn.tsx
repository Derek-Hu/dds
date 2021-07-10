import { Component } from 'react';
import styles from './circle-border-btn.module.less';

type IProps = {
  onClick?: (event?: any) => void;
  fontSize?: string;
  paddingVertical?: string;
  paddingHorizon?: string;
  bgColor?: string;
  isLink?: boolean;
  aTarget?: string;
  aUrl?: string;
};

export class CircleBorderBtn extends Component<IProps, any> {
  render() {
    return this.props.isLink ? (
      <a
        className={styles.btnBorder}
        style={{
          fontSize: this.props.fontSize,
          paddingRight: this.props.paddingHorizon,
          paddingLeft: this.props.paddingHorizon,
          paddingTop: this.props.paddingVertical,
          paddingBottom: this.props.paddingVertical,
          backgroundColor: this.props.bgColor,
        }}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          if (this.props.onClick) {
            this.props.onClick(event);
          }
        }}
        href={this.props.aUrl}
        target={this.props.aTarget}
      >
        {this.props.children}
      </a>
    ) : (
      <div
        className={styles.btnBorder}
        style={{
          fontSize: this.props.fontSize,
          paddingRight: this.props.paddingHorizon,
          paddingLeft: this.props.paddingHorizon,
          paddingTop: this.props.paddingVertical,
          paddingBottom: this.props.paddingVertical,
          backgroundColor: this.props.bgColor,
        }}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          if (this.props.onClick) {
            this.props.onClick(event);
          }
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
