import { Component } from 'react';
import { Input } from 'antd';
import { debounce } from '../../util/debounce';
import { isNumberLike } from '../../util/math';

interface IState {
  amount: string;
}

export default class InputNumberComp extends Component<
  {
    placeholder?: string;
    max?: number;
    className?: string;
    delay?: boolean;
    onChange: (value: number) => any;
  },
  IState
> {
  state: IState = {
    amount: '',
  };

  amountChange = (e: any) => {
    const val = e.target.value;
    const { max } = this.props;

    const isCompatible = (val: string) => val==='' || /^\d+\.\d*$/.test(val);
    // delete or exceed
    if((!isNumberLike(val) && !isCompatible(val)) || (isNumberLike(max) && Number(val) > Number(max!))){
        return;
    }
    this.setState({
      amount: val,
    });
    this.onPropChange && this.onPropChange(Number(val));
  };

  onPropChange = this.props.onChange ? this.props.delay===false ? this.props.onChange: debounce(this.props.onChange) : null;

  render() {
    const { placeholder, className } = this.props;
    const { amount } = this.state;
    return (
      <Input className={className} value={amount} onChange={this.amountChange} placeholder={placeholder} />
    );
  }
}
