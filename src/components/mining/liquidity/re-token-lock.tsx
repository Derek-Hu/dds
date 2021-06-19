import React, { Component } from 'react';
import { Col, Row } from 'antd';
import NormalSelect, { SelectOption } from '../../common/selects/normal-select';
import InputNumber from '../../input';
import NormalButton from '../../common/buttons/normal-btn';
import MaxValTag from '../../common/tags/max-val';
import { getLiquidityReTokenBalance, lockReTokenForLiquidity } from '../../../services/mining.service';
import { AvailableReTokens, defaultState, IProps, IState, reTokenOptions } from './re-token-common';

export default class ReTokenLock extends Component<IProps, IState> {
  state: IState = defaultState();
  inputNum: InputNumber | null = null;

  componentDidMount() {
    getLiquidityReTokenBalance()
      .then((balances: ICoinValue[]) => {
        const available: AvailableReTokens = balances.reduce((acc: AvailableReTokens, balance: ICoinValue) => {
          acc[balance.coin as IReUSDCoins] = balance.value;
          return acc;
        }, {} as AvailableReTokens);

        this.setState({
          availableReTokensAmount: available,
          maxReTokenAmount: available[this.state.curReToken],
        });
      })
      .catch(err => {
        console.warn('error', err);
      });
  }

  onChangeReToken(option: SelectOption) {
    const curTokenType: IReUSDCoins = option.value;
    this.setState({
      curReToken: option.value,
      maxReTokenAmount: this.state.availableReTokensAmount[curTokenType],
    });
  }

  onSelectMax(max: number) {
    this.inputNum?.onMaxOpenClick();
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onAmountSet(count: number) {
    this.setState({ curReTokenAmount: count });
  }

  onLock() {
    this.setState({ isPending: true }, () => {
      lockReTokenForLiquidity(this.state.curReToken, this.state.curReTokenAmount)
        .then((done: boolean) => {
          this.setState({ isPending: false });
          if (done) {
            this.onCancel();
          }
        })
        .catch(() => {
          this.setState({ isPending: false });
        });
    });
  }

  render() {
    return (
      <>
        <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
          <Col xs={24} sm={24} md={8} lg={8}>
            <NormalSelect
              options={reTokenOptions}
              value={this.state.curReToken}
              onSelected={this.onChangeReToken.bind(this)}
            />
          </Col>

          <Col xs={24} sm={24} md={16} lg={16}>
            <MaxValTag maxValue={this.state.maxReTokenAmount} valUnit={'reDAI'} onClick={this.onSelectMax.bind(this)} />
          </Col>

          <Col span={24}>
            <InputNumber
              min={0}
              max={this.state.maxReTokenAmount}
              ref={n => (this.inputNum = n)}
              placeholder={'Locked Token Amount'}
              onChange={this.onAmountSet.bind(this)}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <NormalButton type="default" inModal={true} onClick={this.onCancel.bind(this)}>
              CANCEL
            </NormalButton>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <NormalButton type="primary" inModal={true} loading={this.state.isPending} onClick={this.onLock.bind(this)}>
              LOCK
            </NormalButton>
          </Col>
        </Row>
      </>
    );
  }
}
