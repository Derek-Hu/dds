import { Component } from 'react';
import styles from './circle-border-btn.module.less';

type IProps = {
  onClick?: (event?: any) => void;
};

export class CircleBorderBtn extends Component<IProps, any> {
  render() {
    return (
      <div
        className={styles.btnBorder}
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
