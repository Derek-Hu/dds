import { Component } from 'react';
import { Input, Row, Col, Tag } from 'antd';
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
    suffix?: any;
    delay?: boolean;
    onChange: (value: number) => any;
    tagClassName?: string;
    showTag?: boolean;
  },
  IState
> {
  state: IState = {
    amount: '',
  };

  amountChange = (e: any) => {
    const val = e.target.value;
    const { max } = this.props;

    const isCompatible = (val: string) => val === '' || /^\d+\.\d*$/.test(val);
    // delete or exceed
    if ((!isNumberLike(val) && !isCompatible(val)) || (isNumberLike(max) && Number(val) > Number(max!))) {
      return;
    }
    this.setState({
      amount: val,
    });
    this.onPropChange && this.onPropChange(Number(val));
  };

  onPropChange = this.props.onChange
    ? this.props.delay === false
      ? this.props.onChange
      : debounce(this.props.onChange)
    : null;

  onMaxOpenClick = () => {
    const { max } = this.props;
    this.amountChange({
      target: {
        value: max,
      },
    });
  };
  render() {
    const { placeholder, className, suffix, max, showTag, tagClassName } = this.props;
    const { amount } = this.state;
    return (
      <>
        <Input
          className={className}
          suffix={suffix}
          value={amount}
          onChange={this.amountChange}
          placeholder={placeholder}
        />
        {showTag ? (
          <Row className={tagClassName} type="flex" justify="space-between">
            <Col span={12}>
              <Tag onClick={this.onMaxOpenClick} color="#1346FF">
                Max
              </Tag>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              {max} {suffix}
            </Col>
          </Row>
        ) : null}
      </>
    );
  }
}
