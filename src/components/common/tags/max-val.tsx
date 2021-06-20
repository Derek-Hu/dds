import { Component } from 'react';
import { Tag } from 'antd';
import { format } from '../../../util/math';

type IProps = {
  maxValue: number;
  valUnit: string;
  onClick?: (max: number) => void;
};
type IState = {};

export default class MaxValTag extends Component<IProps, IState> {
  onSelectMax() {
    if (this.props.onClick) {
      this.props.onClick(this.props.maxValue);
    }
  }

  render() {
    return (
      <span onClick={this.onSelectMax.bind(this)} style={{ cursor: 'pointer' }}>
        <Tag color="#1346FF">Max</Tag>
        <span>{format(this.props.maxValue)}</span> {this.props.valUnit}
      </span>
    );
  }
}
