import { Row, Col, message, Button } from 'antd';
import ModalRender from '../../modal-render/index';
import styles from './style.module.less';
import SiteContext from '../../../layouts/SiteContext';
import InputNumber from '../../input/index';
import { formatMessage } from 'locale/i18n';
import { PageTradingPair } from '../../../state-manager/page-state-types';
import { P } from '../../../state-manager/page-state-parser';
import { BaseStateComponent } from '../../../state-manager/base-state-component';
import { BigNumber } from 'ethers';
import { S } from '../../../state-manager/contract-state-parser';
import { toEtherNumber } from '../../../util/ethers';
import NormalButton from '../../common/buttons/normal-btn';

const title = formatMessage({ id: 'funding-fee-deposit' });

interface IProps {
  onConfirm: (depositAmount: number) => any;
}

interface IState {
  depositAmount?: number;
  visible: boolean;
  tradePair: PageTradingPair;
  maxDeposit: BigNumber | null;
}

export default class Deposit extends BaseStateComponent<IProps, IState> {
  state: IState = {
    visible: false,
    tradePair: P.Trade.Pair.default(),
    maxDeposit: BigNumber.from(0),
  };

  componentDidMount() {
    this.registerState('tradePair', P.Trade.Pair);
    this.registerState('maxDeposit', S.User.DepositWalletBalance);
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

  onChangeAmount(depositAmount: number) {
    this.setState({ depositAmount });
  }

  onDeposit() {
    if (this.state.depositAmount && this.state.depositAmount <= 0) {
      return;
    }

    if (Number(this.coinNum(this.state.maxDeposit)) < (this.state.depositAmount as number)) {
      message.warning(formatMessage({ id: 'more-balance-required' }));
      return;
    }

    this.onCancel();
    this.props.onConfirm(this.state.depositAmount as number);
  }

  render() {
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <>
            <Button type="link" onClick={() => this.setState({ visible: true })}>
              {formatMessage({ id: 'deposit' })}
            </Button>
            <ModalRender
              visible={this.state.visible}
              onCancel={this.onCancel.bind(this)}
              footer={null}
              height={340}
              title={title}
              className={styles.commonModal}
            >
              <div>
                {/* deposit number */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <InputNumber
                      className={styles.orderInput}
                      onChange={this.onChangeAmount.bind(this)}
                      placeholder={
                        this.state.maxDeposit !== null
                          ? `${formatMessage({ id: 'max' })} ${this.coinNum(this.state.maxDeposit)}`
                          : '0.00'
                      }
                      max={Number(this.coinNum(this.state.maxDeposit))}
                      showTag={true}
                      skip={true}
                      suffix={this.state.tradePair.quote.description}
                    />
                  </Col>
                </Row>

                <Row className={styles.actionBtns} gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <NormalButton type={'default'} onClick={this.onCancel.bind(this)} inModal={true}>
                      {formatMessage({ id: 'cancel' })}
                    </NormalButton>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <NormalButton type={'primary'} onClick={this.onDeposit.bind(this)} inModal={true}>
                      {formatMessage({ id: 'deposit' })}
                    </NormalButton>
                  </Col>
                </Row>
              </div>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
