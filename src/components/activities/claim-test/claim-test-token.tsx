import { Component } from 'react';
import ModalRender from '../../modal-render/index';
import { CircleBorderBtn } from '../../common/buttons/circle-border-btn';
import NormalButton from '../../common/buttons/normal-btn';
import { contractAccessor } from '../../../wallet/chain-access';
import { loginUserAccount } from '../../../services/account';
import { from } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Col, message, Row } from 'antd';

type IProps = {};
type IState = {
  isPopUp: boolean;
  isClaimed: boolean;
  isPending: boolean;
};

export class ClaimTestToken extends Component<IProps, IState> {
  state: IState = {
    isPopUp: false,
    isClaimed: false,
    isPending: false,
  };

  componentDidMount() {
    this.loadIsClaimed();
  }

  loadIsClaimed() {
    from(loginUserAccount())
      .pipe(
        switchMap((account: string) => {
          return contractAccessor.isTestTokenClaimed(account, 'DAI');
        })
      )
      .subscribe(isClaimed => {
        this.setState({ isClaimed: isClaimed });
      });
  }

  onClaim() {
    this.setState({ isPending: true });
    contractAccessor
      .claimTestToken('DAI')
      .pipe(
        finalize(() => {
          this.setState({ isPending: false });
          this.loadIsClaimed();
        })
      )
      .subscribe(isOk => {
        if (isOk) {
          message.success('Claim Success!');
        } else {
          message.error('Claim Failed!');
        }
      });
  }

  render() {
    return (
      <>
        <CircleBorderBtn onClick={() => this.setState({ isPopUp: true })}>
          <a>Claim Test Token</a>
        </CircleBorderBtn>
        <ModalRender
          visible={this.state.isPopUp}
          title="Claim Test Token"
          footer={null}
          onCancel={() => this.setState({ isPopUp: false })}
        >
          <div>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <NormalButton type={'default'} onClick={() => this.setState({ isPopUp: false })}>
                  CANCEL
                </NormalButton>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12}>
                <NormalButton
                  type={'primary'}
                  onClick={this.onClaim.bind(this)}
                  loading={this.state.isPending}
                  disabled={this.state.isClaimed}
                >
                  {this.state.isClaimed ? <span>You Has Claimed</span> : <span>CLAIM</span>}
                </NormalButton>
              </Col>
            </Row>
          </div>
        </ModalRender>
      </>
    );
  }
}
