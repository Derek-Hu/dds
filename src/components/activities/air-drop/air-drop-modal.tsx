import { Component } from 'react';
import ModalRender from '../../modal-render/index';
import styles from './air-drop-modal.module.less';
import { airdropAvailable, claimAirdrop } from '../../../services/activities';
import { Col, Row } from 'antd';
import { format } from '../../../util/math';
import SiteContext from '../../../layouts/SiteContext';
import { shortAddress } from '../../../util';
import NormalButton from '../../common/buttons/normal-btn';
import { loginUserAccount } from '../../../services/account';
import Mask from '../../mask/index';

type IProps = {};
type IState = {
  isPopup: boolean;
  claimAmount: number;
  claimAvailable: boolean | null;
  modalTitle: string;
};

export class AirDropModal extends Component<IProps, IState> {
  static contextType = SiteContext;

  state: IState = {
    isPopup: false,
    claimAmount: 0,
    claimAvailable: null,
    modalTitle: '',
  };

  curUserAddress: string | null = null;

  componentWillMount() {
    this.loadClaimAmount();
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
    if (this.context.address !== this.curUserAddress) {
      this.loadClaimAmount();
    }
  }

  popModal() {
    this.setState({ isPopup: true });
    this.loadClaimAmount();
  }

  closeModal() {
    this.setState({ isPopup: false });
  }

  loadClaimAmount() {
    loginUserAccount().then(account => (this.curUserAddress = account));
    airdropAvailable().subscribe((amount: number) => {
      this.setState({
        claimAmount: amount,
        claimAvailable: amount > 0,
        modalTitle: amount > 0 ? 'Airdrops Available' : 'No Airdrops Available',
      });
    });
  }

  onCancel() {
    this.setState({ isPopup: false });
  }

  onClaim() {
    const pendingTitle = 'Airdrop';
    Mask.showLoading('Transferring...', pendingTitle);
    claimAirdrop().subscribe(done => {
      if (done) {
        Mask.showSuccess(pendingTitle);
        this.onCancel();
      } else {
        Mask.showFail(null, pendingTitle);
      }
    });
  }

  render() {
    const claimAmount = (
      <div className={styles.block}>
        <Row gutter={[16, 16]}>
          <Col span={24} className={styles.wrapper}>
            <span className={styles.amount}>{format(this.state.claimAmount)}</span>
            <span className={styles.span} />
            <span className={styles.amount}>SLD</span>
          </Col>
          <Col span={24} className={styles.wrapper}>
            <span className={styles.addressTitle}>Claim Address: </span>
            <span className={styles.addressContent}>{shortAddress(this.context.address, true)}</span>
          </Col>
        </Row>
      </div>
    );

    const noClaim = (
      <div className={styles.block}>
        <span className={styles.noText}>Your address has no airdrops to claim.</span>
      </div>
    );

    return (
      <>
        <div className={styles.airIcon} onClick={this.popModal.bind(this)}>
          Airdrop
        </div>
        <ModalRender
          visible={this.state.isPopup}
          footer={null}
          title={this.state.modalTitle}
          onCancel={this.closeModal.bind(this)}
        >
          {this.state.claimAvailable ? claimAmount : noClaim}

          <div className={styles.block2}>
            <Row>
              <Col span={24}>
                <a>Airdrop Rules</a>
              </Col>
            </Row>
          </div>

          <div>
            {this.state.claimAvailable ? (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <NormalButton type={'default'} onClick={this.onCancel.bind(this)}>
                    CANCEL
                  </NormalButton>
                </Col>
                <Col span={12}>
                  <NormalButton type={'primary'} onClick={this.onClaim.bind(this)}>
                    CLAIM
                  </NormalButton>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={24}>
                  <NormalButton type={'primary'} onClick={this.onCancel.bind(this)}>
                    CLOSE
                  </NormalButton>
                </Col>
              </Row>
            )}
          </div>
        </ModalRender>
      </>
    );
  }
}
