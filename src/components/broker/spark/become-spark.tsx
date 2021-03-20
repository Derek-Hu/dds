import { Component } from 'react';
import { Row, Col } from 'antd';
import styles from '../become-spark.module.less';
import mainStyles from '../style.module.less';
import { formatInt, format } from '../../../util/math';
import { getSparkData } from '../../../services/broker.service';
import Placeholder from '../../placeholder/index';

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
          <h3>Become a Shield Spark</h3>
          <p className={styles.descOne}>
            Spread DeFi Spark across the globe
            <br />
            Unlock your influence and turn it into commission
          </p>
          <div className={styles.percentage}>
            <Placeholder width={'50%'} loading={loading}>
              {data?.commission}%
            </Placeholder>
          </div>
          <p className={styles.descTwo}>Settlement Fee Commission</p>
          <Row className={styles.tabSpark}>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>20+</span>
              <span>Countries</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>{formatInt(124)}</span>
              <span>Sparks</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>
                <Placeholder width={'50%'} loading={loading}>
                  {formatInt(data?.referals)}
                </Placeholder>
              </span>
              <span>Referals</span>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>
                <Placeholder width={'50%'} loading={loading}>
                  {format(data?.bonus)}
                </Placeholder>
              </span>
              <span>Commission(USD)</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
