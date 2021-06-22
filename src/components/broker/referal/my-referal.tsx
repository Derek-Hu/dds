import { Component } from 'react';
import { Row, Col, Button, message } from 'antd';
import styles from '../style.module.less';
import { formatInt, format, isGreaterZero } from '../../../util/math';
import { getMyReferalInfo, claimReferalInfo } from '../../../services/broker.service';
import Placeholder from '../../placeholder/index';
import { formatMessage } from 'util/i18n';

interface IState {
  loading: boolean;
  referalInfo?: IBrokerReferal;
}

export default class Broker extends Component<any, IState> {
  state: IState = {
    loading: false,
  };
  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true });
    const referalInfo = await getMyReferalInfo();
    this.setState({
      referalInfo,
    });

    this.setState({ loading: false });
  }

  onClaim = async () => {
    const { referalInfo } = this.state;
    const { bonus } = referalInfo || {};
    if (!isGreaterZero(bonus)) {
      message.warn(formatMessage({ id: 'no-available-to-claim' }));
      return;
    }
    const success = await claimReferalInfo();
    if (success) {
      this.loadData();
    }
  };

  render() {
    const { loading, referalInfo } = this.state;
    const { level, ranking, referals, bonus } = referalInfo || {};
    return (
      <div>
        <h3>{formatMessage({ id: 'summary' })}</h3>
        <Row className="padding-bottom-60">
          {/* <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
            <span className={styles.ads}>{level}</span>
            <span>Current Level</span>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
            <span className={styles.ads}>{formatInt(ranking)}</span>
            <span>Ranking</span>
          </Col> */}
          <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
            <span className={styles.ads}>
              <Placeholder width={'50%'} loading={loading}>
                {formatInt(referals)}
              </Placeholder>
            </span>
            <span>{formatMessage({ id: 'referrals' })}</span>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
            <span className={styles.ads}>
              <Placeholder width={'50%'} loading={loading}>
                {format(bonus)}
              </Placeholder>
            </span>
            <span>{formatMessage({ id: 'commission-balance-usd' })}</span>
          </Col>
        </Row>
        <div style={{ marginTop: '48px', paddingBottom: '20px' }}>
          <div>
            {/* <Visible when={isGreaterZero(bonus)}> */}
            <Button onClick={this.onClaim} style={{ width: '50%', margin: '20px' }} type="primary">
              {formatMessage({ id: 'claim' })}
            </Button>
            {/* </Visible> */}
          </div>
        </div>
      </div>
    );
  }
}
