import { Component } from 'react';
import styles from './circle-border-btn.module.less';

type IProps = {
  onClick?: (event?: any) => void;
  fontSize?: string;
  paddingVertical?: string;
  paddingHorizon?: string;
};

export class CircleBorderBtn extends Component<IProps, any> {
  render() {
    return (
      <div
        className={styles.btnBorder}
        style={{
          fontSize: this.props.fontSize,
          paddingRight: this.props.paddingHorizon,
          paddingLeft: this.props.paddingHorizon,
          paddingTop: this.props.paddingVertical,
          paddingBottom: this.props.paddingVertical,
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
