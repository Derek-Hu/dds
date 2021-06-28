import { Component } from 'react';
import ModalRender from '../../modal-render/index';
import styles from './air-drop-modal.module.less';
import { airdropAvailable } from '../../../services/activities';
import { Col, Row } from 'antd';
import { format } from '../../../util/math';
import SiteContext from '../../../layouts/SiteContext';
import { shortAddress } from '../../../util';
import NormalButton from '../../common/buttons/normal-btn';

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

  componentWillMount() {
    this.loadClaimAmount();
  }

  popModal() {
    this.setState({ isPopup: true });
    this.loadClaimAmount();
  }

  closeModal() {
    this.setState({ isPopup: false });
  }

  loadClaimAmount() {
    airdropAvailable().subscribe((amount: number) => {
      this.setState({
        claimAmount: amount,
        claimAvailable: amount > 0,
        modalTitle: amount > 0 ? 'Airdrops Available' : 'No Airdrops Available',
      });
    });
  }

  render() {
    return (
      <>
        <div className={styles.airIcon} onClick={this.popModal.bind(this)}>
          Air Drop
        </div>
        <ModalRender
          visible={this.state.isPopup}
          footer={null}
          title={this.state.modalTitle}
          onCancel={this.closeModal.bind(this)}
        >
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24} className={styles.wrapper}>
                <span className={styles.amount}>{format(333333)}</span>
                <span className={styles.span}></span>
                <span className={styles.amount}>SLD</span>
              </Col>
              <Col span={24} className={styles.wrapper}>
                <span className={styles.addressTitle}>Claim Address: </span>
                <span className={styles.addressContent}>{shortAddress(this.context.address)}</span>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <a>Airdrop Rules</a>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <NormalButton type={'default'}>CANCEL</NormalButton>
              </Col>
              <Col span={12}>
                <NormalButton type={'primary'}>CLAIM</NormalButton>
              </Col>
            </Row>
          </div>
        </ModalRender>
      </>
    );
  }
}
