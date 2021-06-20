import { Component } from 'react';
import { queryLiquidityLockedReTokenAmount, queryUserReTokenBalance } from '../../../services/mining.service';
import { Col, Row } from 'antd';
import commonStyles from '../../funding-balance/modals/style.module.less';
import ModalRender from '../../modal-render';
import { SelectOption } from '../../common/selects/normal-select';
import ReTokenLock from './re-token-lock';
import ReTokenUnlock from './re-token-unlock';
import { SecondaryCard } from '../../common/card/secondary-card';
import styles from './re-token-balance.module.less';
import NormalButton from '../../common/buttons/normal-btn';
import { ReTokenAmounts } from '../../../services/mining.service.interface';
import { format } from '../../../util/math';

type IState = {
  showLockModal: boolean;
  showUnLockModal: boolean;
  reTokenBalance: ReTokenAmounts;
  lockedReTokenAmounts: ReTokenAmounts;
};

export default class ReTokenBalance extends Component<{}, IState> {
  state = {
    showLockModal: false,
    showUnLockModal: false,
    reTokenBalance: {
      reDAI: 0,
      reUSDT: 0,
      reUSDC: 0,
    },
    lockedReTokenAmounts: {
      reDAI: 0,
      reUSDT: 0,
      reUSDC: 0,
    },
  };

  reTokenOptions: SelectOption[] = [
    {
      label: 'reDAI',
      value: 'reDAI',
    },
  ];

  componentDidMount() {
    this.loadBalances();
  }

  loadBalances() {
    queryUserReTokenBalance()
      .then((reTokenBalance: ReTokenAmounts) => {
        this.setState({ reTokenBalance: reTokenBalance });
      })
      .catch();

    queryLiquidityLockedReTokenAmount()
      .then((reTokenLocked: ReTokenAmounts) => {
        this.setState({ lockedReTokenAmounts: reTokenLocked });
      })
      .catch();
  }

  openLockModal() {
    this.setState({ showLockModal: true });
  }

  closeLockModal() {
    this.setState({ showLockModal: false });
    this.loadBalances();
  }

  openUnLockModal() {
    this.setState({ showUnLockModal: true });
  }

  closeUnLockModal() {
    this.setState({ showUnLockModal: false });
  }

  render() {
    return (
      <>
        {/*<CoinCard title="Your reToken Balance" theme="inner" service={queryUserReTokenBalance}>*/}
        {/*  <Placeholder loading={false} style={{ margin: '22px 0' }}>*/}
        {/*    */}
        {/*  </Placeholder>*/}
        {/*</CoinCard>*/}
        <SecondaryCard title="Your reToken Balance">
          <Row>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceCol}>
              {}
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNum}>
              Balance
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNumLock}>
              Locked
            </Col>
          </Row>

          <Row>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceCol}>
              reDAI
            </Col>

            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNum}>
              {format(this.state.reTokenBalance.reDAI)}
            </Col>

            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNumLock}>
              {format(this.state.lockedReTokenAmounts.reDAI)}
            </Col>
          </Row>

          <Row>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceCol}>
              reUSDT
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNum}>
              {format(this.state.reTokenBalance.reUSDT)}
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNumLock}>
              {format(this.state.lockedReTokenAmounts.reUSDT)}
            </Col>
          </Row>

          <Row>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceCol}>
              reUSDC
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNum}>
              {format(this.state.reTokenBalance.reUSDC)}
            </Col>
            <Col lg={8} md={8} sm={8} xs={8} className={styles.balanceColNumLock}>
              {format(this.state.lockedReTokenAmounts.reUSDC)}
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <NormalButton type="primary" onClick={this.openLockModal.bind(this)}>
                LOCK TOKENS
              </NormalButton>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <NormalButton type="primary" onClick={this.openUnLockModal.bind(this)}>
                UNLOCK TOKENS
              </NormalButton>
            </Col>
          </Row>
        </SecondaryCard>

        <ModalRender
          visible={this.state.showLockModal}
          title="Lock Tokens"
          className={commonStyles.commonModal}
          onCancel={this.closeLockModal.bind(this)}
          okText={'Claim'}
          height={420}
          footer={null}
        >
          <ReTokenLock onCancel={this.closeLockModal.bind(this)} />
        </ModalRender>

        <ModalRender
          visible={this.state.showUnLockModal}
          title="Unlock Tokens"
          className={commonStyles.commonModal}
          onCancel={this.closeUnLockModal.bind(this)}
          okText={'Claim'}
          height={420}
          footer={null}
        >
          <ReTokenUnlock onCancel={this.closeUnLockModal.bind(this)} />
        </ModalRender>
      </>
    );
  }
}
