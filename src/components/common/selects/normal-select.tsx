import { Component } from 'react';
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import styles from './normal-select.module.less';

const { Option } = Select;

export type SelectOption = {
  label: string;
  value: any;
  disabled?: boolean;
};

type IProps = {
  options: SelectOption[];
  value?: any;
  onSelected?: (ops: SelectOption) => void;
};
type IState = {};

export default class NormalSelect extends Component<IProps, IState> {
  onSelectedChange(selectVal: any) {
    const selectedOps: SelectOption | undefined = this.props.options.find(one => _.isEqual(one.value, selectVal));
    if (selectedOps && this.props.onSelected) {
      this.props.onSelected(selectedOps);
    }
  }

  render() {
    return (
      <Select
        defaultValue={this.props.value}
        value={this.props.value}
        className={styles.select}
        onChange={this.onSelectedChange.bind(this)}
      >
        {this.props.options.map(one => {
          return <Option value={one.value}>{one.label}</Option>;
        })}
      </Select>
    );
  }
}
