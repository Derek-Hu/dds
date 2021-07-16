import { Button, Row, Col } from 'antd';
import styles from './style.module.less';
import ModalRender from '../../modal-render/index';
import SiteContext from '../../../layouts/SiteContext';
import InputNumber from '../../input/index';
import { formatMessage } from 'locale/i18n';
import { BaseStateComponent } from '../../../state-manager/base-state-component';
import { BigNumber } from 'ethers';
import { toEtherNumber } from '../../../util/ethers';
import { PageTradingPair } from '../../../state-manager/page-state-types';
import { P } from '../../../state-manager/page-state-parser';
import NormalButton from '../../common/buttons/normal-btn';
import { UserTradeAccountInfo } from '../../../state-manager/contract-state-types';
import { S } from '../../../state-manager/contract-state-parser';

const title = formatMessage({ id: 'funding-fee-withdraw' });

interface IProps {
  onConfirm: (amount: number) => any;
}

interface IState {
  amount?: number;
  withdrawAmount: number;
  visible: boolean;
  userAccountInfo: UserTradeAccountInfo | null;
  tradePair: PageTradingPair;
}

export default class Withdraw extends BaseStateComponent<IProps, IState> {
  state: IState = {
    withdrawAmount: 0,
    visible: false,
    userAccountInfo: null,
    tradePair: P.Trade.Pair.default(),
  };

  componentDidMount() {
    this.registerState('userAccountInfo', S.User.CurTradePairAccount);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  coinNum(num: BigNumber | null | undefined): string {
    return toEtherNumber(num, 2, this.state.tradePair.quote);
  }

  onCancel() {
    this.setState({ visible: false });
  }

  onWithdraw() {
    if (this.state.withdrawAmount <= 0) {
      return;
    }

    this.onCancel();
    this.props.onConfirm(this.state.withdrawAmount);
  }

  onChangeAmount(withdrawAmount: number) {
    this.setState({ withdrawAmount });
  }

  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <>
            <Button type="link" onClick={() => this.setState({ visible: true })}>
              {formatMessage({ id: 'withdraw' })}
            </Button>

            <ModalRender
              visible={this.state.visible}
              onCancel={this.onCancel.bind(this)}
              footer={null}
              height={375}
              title={title}
              className={styles.commonModal}
            >
              <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <InputNumber
                    className={styles.orderInput}
                    onChange={this.onChangeAmount.bind(this)}
                    placeholder={`${formatMessage({ id: 'max' })} ${this.coinNum(
                      this.state.userAccountInfo?.available
                    )}`}
                    max={Number(this.coinNum(this.state.userAccountInfo?.available))}
                    showTag={true}
                    suffix={this.state.tradePair.quote.description}
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]} className={styles.actionBtns} style={{ paddingTop: '8px' }} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <NormalButton type={'default'} inModal={true} onClick={this.onCancel.bind(this)}>
                    {formatMessage({ id: 'cancel' })}
                  </NormalButton>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <NormalButton type={'primary'} inModal={true} onClick={this.onWithdraw.bind(this)}>
                    {formatMessage({ id: 'withdraw' })}
                  </NormalButton>
                </Col>
              </Row>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
