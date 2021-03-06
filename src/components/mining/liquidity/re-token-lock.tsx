import React, { Component } from 'react';
import { Col, Row } from 'antd';
import NormalSelect, { SelectOption } from '../../common/selects/normal-select';
import InputNumber from '../../input';
import NormalButton from '../../common/buttons/normal-btn';
import MaxValTag from '../../common/tags/max-val';
import {
  approveReTokenForLocking,
  lockReTokenForLiquidity,
  queryUserReTokenBalance,
} from '../../../services/mining.service';
import { defaultState, IProps, IState, reTokenOptions } from './re-token-common';
import { ReTokenAmounts } from '../../../services/mining.service.interface';
import Mask from '../../../components/mask';
import { Subscription } from 'rxjs';

export default class ReTokenLock extends Component<IProps, IState> {
  state: IState = defaultState();
  inputNum: InputNumber | null = null;

  sub: Subscription | null = null;

  componentDidMount() {
    this.loadBalances();
    this.sub = this.props.refreshEvent.subscribe(() => {
      this.loadBalances();
    });
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadBalances() {
    queryUserReTokenBalance()
      .then((reTokenBalance: ReTokenAmounts) => {
        this.setState({
          availableReTokensAmount: reTokenBalance,
          maxReTokenAmount: reTokenBalance[this.state.curReToken],
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

  onSuccessLock() {
    this.loadBalances();
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

  // do lock in this modal.
  doLock() {
    this.startPending();
    approveReTokenForLocking(this.state.curReToken, this.state.curReTokenAmount)
      .then(done => {
        if (done) {
          return lockReTokenForLiquidity(this.state.curReToken, this.state.curReTokenAmount);
        } else {
          this.endPending();
        }
      })
      .then(done => {
        if (done) {
          this.onSuccessLock();
          this.onCancel();
          this.endPending();
        } else {
          this.endPending(true, 'Lock reTokens Failed.');
        }
      })
      .catch(() => {
        this.endPending(true);
      });
  }

  onLock() {
    if (this.props.doAction) {
      this.props.doAction(this.state.curReToken, this.state.curReTokenAmount);
    }
  }

  startPending() {
    this.setState({ isPending: true });
  }

  endPending(isFail: boolean = false, failText: string = '') {
    this.setState({ isPending: false });
    if (isFail) {
      Mask.showFail(failText || undefined);
    }
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
