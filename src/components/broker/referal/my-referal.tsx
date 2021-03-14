import { Component } from 'react';
import { Row, Col, Button } from 'antd';
import styles from '../style.module.less';
import { formatInt, format } from '../../../util/math';
import { getMyReferalInfo } from '../../../services/broker.service';
import { Hidden } from '../../builtin/hidden';

interface IState {
  loading: boolean;
  referalInfo?: IBrokerReferal;
}

export default class Broker extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const referalInfo = await getMyReferalInfo();
    this.setState({
      referalInfo,
    });

    this.setState({ loading: false });
  }

  onClaim=() => {

  }

  render() {
    const { loading, referalInfo } = this.state;
    const { level, ranking, referals, bonus } = referalInfo || {};
    return (
      <Hidden when={loading}>
        <h3>Summary</h3>
        <Row className="padding-bottom-60">
          <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
            <span className={styles.ads}>{level}</span>
            <span>Current Level</span>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
            <span className={styles.ads}>{formatInt(ranking)}</span>
            <span>Ranking</span>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} className={styles.col}>
            <span className={styles.ads}>{formatInt(referals)}</span>
            <span>Referrals</span>
          </Col>
        </Row>
        <div style={{ marginTop: '48px', paddingBottom: '40px' }}>
          <span className={styles.ads}>{format(bonus)}</span>
          <span>Bonus(USD)</span>
          <div>
            <Button onClick={this.onClaim} style={{ width: '120px', margin: '20px' }} type="primary">
              Claim
            </Button>
          </div>
        </div>
      </Hidden>
    );
  }
}
