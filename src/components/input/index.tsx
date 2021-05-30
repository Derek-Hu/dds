import { Component } from 'react';
import { Input, Row, Col, Tag } from 'antd';
import { debounce } from '../../util/debounce';
import { isNumberLike } from '../../util/math';
import styles from './style.module.less';

interface IState {
  amount: string;
}

export default class InputNumberComp extends Component<
  {
    placeholder?: string;
    max?: number;
    min?: number;
    className?: string;
    disabled?: boolean;
    suffix?: any;
    delay?: boolean;
    onChange: (value: number) => any;
    tagClassName?: string;
    showTag?: boolean;
    skip?: boolean;
    value?: number;
  },
  IState
> {
  state: IState = {
    amount: '',
  };

  amountChange = (e: any) => {
    const val = e.target.value;
    const { max, min, skip } = this.props;

    // const isCompatible = (val: string) => val === '' || /^\d+\.\d*$/.test(val);
    // delete or exceed
    // if ((!isNumberLike(val) && !isCompatible(val)) || (isNumberLike(max) && Number(val) > Number(max!))) {
    //   return;
    // }
    const isCompatible =
      /^[1-9]\d{0,8}$/.test(val) ||
      /^[1-9]\d{0,8}\.\d{0,2}?$/.test(val) ||
      /^0\.\d{0,2}?$/.test(val) ||
      val === '' ||
      val === '0';
    if (!isCompatible) {
      return;
    }
    if (!skip) {
      if (isNumberLike(max) && isNumberLike(val) && Number(val) > Number(max!)) {
        return;
      }
      if (isNumberLike(min) && isNumberLike(val) && Number(val) < Number(min!)) {
        return;
      }
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

  static getDerivedStateFromProps(nextProps: any, prevState: IState) {
    const newVal: number = Number(nextProps.value);
    if (newVal && !isNaN(newVal) && prevState.amount !== newVal.toString()) {
      return { amount: newVal.toString() };
    }

    return null;
  }

  render() {
    const { placeholder, className, disabled, suffix, max, showTag, tagClassName } = this.props;
    const { amount } = this.state;
    return (
      <>
        <Input
          className={className}
          disabled={disabled}
          suffix={suffix}
          value={amount}
          onChange={this.amountChange}
          placeholder={placeholder}
        />
        {showTag ? (
          <Row
            className={[tagClassName, styles.maxTagContainer].join(' ')}
            type="flex"
            align="middle"
            justify="space-between"
          >
            <Col span={12}>
              <Tag style={{ cursor: 'pointer' }} onClick={this.onMaxOpenClick} color="#1346FF">
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
