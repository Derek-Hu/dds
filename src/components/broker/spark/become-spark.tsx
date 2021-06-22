import { Component } from 'react';
import { Row, Col } from 'antd';
import styles from '../become-spark.module.less';
import mainStyles from '../style.module.less';
import { formatInt } from '../../../util/math';
import { getSparkData } from '../../../services/broker.service';
import Placeholder from '../../placeholder/index';
import { formatMessage } from 'util/i18n';

interface IState {
  loading: boolean;
  data?: IBrokerSpark;
}
export default class BecomeSpark extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getSparkData();
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div className={mainStyles.becomeContainer}>
        <div className={styles.root}>
          <h3>{formatMessage({ id: 'become-shield-spark' })}</h3>
          <p className={styles.descOne}>
            {formatMessage({ id: 'spread-defi-spark-global' })}
            <br />
            {formatMessage({ id: 'unlock-influence-to-commission' })}
          </p>
          <div className={styles.percentage}>
            <Placeholder width={'50%'} loading={loading}>
              {data?.commission}%
            </Placeholder>
          </div>
          <p className={styles.descTwo}>{formatMessage({ id: 'commission-rate' })}</p>
          <Row className={styles.tabSpark}>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>20+</span>
              <span>{formatMessage({ id: 'countries' })}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>{formatInt(124)}</span>
              <span>{formatMessage({ id: 'sparks' })}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>
                <Placeholder width={'50%'} loading={loading}>
                  {formatInt(data?.referals)}
                </Placeholder>
              </span>
              <span>{formatMessage({ id: 'referrals' })}</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>
                <Placeholder width={'50%'} loading={loading}>
                  {formatInt(data?.bonus)}
                </Placeholder>
              </span>
              <span>{formatMessage({ id: 'commission-usd' })}</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
