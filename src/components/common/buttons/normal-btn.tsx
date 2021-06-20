import { Button } from 'antd';
import { Component } from 'react';
import { ButtonType } from 'antd/lib/button';
import styles from './normal-btn.module.less';

type IState = {};
type IProps = {
  children?: any;
  type: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  inModal?: boolean;
};

export default class NormalButton extends Component<IProps, IState> {
  render() {
    const classNames = [styles.btn];
    if (this.props.inModal) {
      classNames.push(styles.modal);
    }

    return (
      <Button
        type={this.props.type}
        loading={this.props.loading}
        className={classNames.join(' ')}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </Button>
    );
  }
}
