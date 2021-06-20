import React, { Component } from 'react';
import { Col, Row } from 'antd';
import NormalSelect, { SelectOption } from '../../common/selects/normal-select';
import { defaultState, IProps, IState, reTokenOptions } from './re-token-common';
import MaxValTag from '../../common/tags/max-val';
import Mask from '../../../components/mask';
import InputNumber from '../../input';
import NormalButton from '../../common/buttons/normal-btn';
import { queryLiquidityLockedReTokenAmount, unLockReTokenForLiquidity } from '../../../services/mining.service';

export default class ReTokenUnlock extends Component<IProps, IState> {
  state: IState = defaultState();
  inputNum: InputNumber | null = null;

  componentDidMount() {
    this.loadLockedAmount();
  }

  loadLockedAmount() {
    queryLiquidityLockedReTokenAmount().then(amount => {
      this.setState({
        availableReTokensAmount: amount,
        maxReTokenAmount: amount[this.state.curReToken],
      });
    });
  }

  onChangeReToken(option: SelectOption) {
    this.setState(
      {
        curReToken: option.value,
        maxReTokenAmount: this.state.availableReTokensAmount[option.value as IReUSDCoins],
      },
      () => {
        this.onSelectMax();
      }
    );
  }

  onSelectMax() {
    this.inputNum?.onMaxOpenClick();
  }

  onAmountSet(count: number) {
    this.setState({ curReTokenAmount: count });
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onUnlock() {
    if (this.state.curReTokenAmount === 0 || this.state.curReTokenAmount > this.state.maxReTokenAmount) {
      return;
    }

    this.startPending();
    unLockReTokenForLiquidity(this.state.curReToken, this.state.curReTokenAmount).then((done: boolean) => {
      if (done) {
        this.onCancel();
        this.endPending();
      } else {
        this.endPending(true, 'Unlock ReTokens Failed.');
      }
    });
  }

  private startPending() {
    this.setState({ isPending: true });
  }

  private endPending(isFail = false, failText: string = '') {
    if (isFail) {
      Mask.showFail(failText);
    }
    this.setState({ isPending: false });
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
              min={1}
              max={this.state.maxReTokenAmount}
              ref={n => (this.inputNum = n)}
              placeholder={'Unlocked Token Amount'}
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
            <NormalButton
              type="primary"
              inModal={true}
              loading={this.state.isPending}
              onClick={this.onUnlock.bind(this)}
            >
              UNLOCK
            </NormalButton>
          </Col>
        </Row>
      </>
    );
  }
}
