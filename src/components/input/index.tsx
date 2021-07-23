import { Component } from 'react';
import { Input, Row, Col, Tag } from 'antd';
import { debounce } from '../../util/debounce';
import { isNumberLike } from '../../util/math';
import styles from './style.module.less';
import { formatMessage } from 'locale/i18n';

interface IState {
  amount: string;
  cacheInputAmount: number | null | undefined;
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
    value?: number | null;
    mustInt?: boolean;
  },
  IState
> {
  state: IState = { amount: '', cacheInputAmount: undefined };

  amountChange = (e: any) => {
    const val: string = e.target.value;

    const { max, min, skip, mustInt } = this.props;

    const isInt = /^[1-9]\d{0,8}$/.test(val) || val === '0';
    const isFloat = /^[1-9]\d{0,8}\.\d{0,2}?$/.test(val) || /^0\.\d{0,2}?$/.test(val);
    const isEmpty = val === '';
    const isCompatible = mustInt ? isInt || isEmpty : isInt || isFloat || isEmpty;

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

    this.setState({ amount: val }, () => {
      this.onPropChange && this.onPropChange(Number(val));
    });
  };

  onPropChange = this.props.onChange
    ? this.props.delay === false
      ? this.props.onChange
      : debounce(this.props.onChange)
    : null;

  onBlur() {
    if (this.state.cacheInputAmount !== undefined) {
      const lastVal = this.state.cacheInputAmount === null ? '' : this.state.cacheInputAmount.toString();
      this.setState({ amount: lastVal });
    }
  }

  onMaxOpenClick = () => {
    const { max } = this.props;
    this.amountChange({
      target: {
        value: max,
      },
    });
  };

  static valCache: number | null = null;

  // deal with value property input.
  static getDerivedStateFromProps(nextProps: any, prevState: IState) {
    if (nextProps.value === undefined) {
      return;
    }

    // income value
    const newVal: number | null = nextProps.value === null ? null : Number(nextProps.value);

    // income value was not changed, return;
    if ((newVal !== null && isNaN(newVal)) || newVal === prevState.cacheInputAmount) {
      return null;
    }

    // update income value cache
    const rs = { cacheInputAmount: newVal };
    // update real amount if needed.
    if (newVal === null || newVal === 0) {
      Object.assign(rs, { amount: '' });
    } else if (prevState.amount !== newVal.toString()) {
      Object.assign(rs, { amount: newVal.toString() });
    }

    return rs;
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
          onBlur={this.onBlur.bind(this)}
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
                {formatMessage({ id: 'max-all' })}
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
