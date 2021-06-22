import { Component } from 'react';
import ModalRender from '../../modal-render/index';
import NormalButton from '../../common/buttons/normal-btn';
import { contractAccessor } from '../../../wallet/chain-access';
import { loginUserAccount } from '../../../services/account';
import { from } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Col, message, Row } from 'antd';
import styles from './claim-test-token.module.less';

type IProps = {
  visibleChange?: (visible: boolean) => void;
};
type IState = {
  isPopUp: boolean;
  isClaimed: boolean;
  isPending: boolean;
  curAddress: string;
};

export class ClaimTestToken extends Component<IProps, IState> {
  state: IState = {
    isPopUp: false,
    isClaimed: false,
    isPending: false,
    curAddress: '',
  };

  componentDidMount() {
    this.loadUserAddress();
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

  loadUserAddress() {
    loginUserAccount().then(addr => this.setState({ curAddress: addr }));
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

  changePopUp(isVisible: boolean) {
    this.setState({ isPopUp: isVisible }, () => {
      if (this.props.visibleChange) {
        this.props.visibleChange(this.state.isPopUp);
      }
    });
  }

  render() {
    return (
      <>
        <div onClick={() => this.changePopUp(true)}>{this.props.children}</div>
        <ModalRender
          visible={this.state.isPopUp}
          title="5000 Test ShieldDAI Claim"
          footer={null}
          onCancel={() => this.changePopUp(false)}
        >
          <div>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <span className={styles.address}>Address:</span>
                <br />
                <span className={styles.addressHex}>{this.state.curAddress}</span>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <NormalButton type={'default'} onClick={() => this.changePopUp(false)}>
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
