import { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import styles from '../style.module.less';
import { format } from '../../../util/math';
import { getLiquiditorReward } from '../../../services/mining.service';
import SiteContext from '../../../layouts/SiteContext';
import Auth from '../../builtin/auth';
import Placeholder from '../../placeholder/index';
import { formatMessage } from 'locale/i18n';

interface IState {
  loading: boolean;
  data?: { campaign: number; compensate: number };
}

export default class LiquiditorReward extends Component<{ isBSC: boolean }, IState> {
  state: IState = {
    loading: false,
  };

  static contextType = SiteContext;

  UNSAFE_componentWillReceiveProps() {
    this.loadData();
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true });
    const data = await getLiquiditorReward(this.context.address ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { isBSC } = this.props;
    const { campaign, compensate } = data || {};
    return (
      <div className={styles.liquiditorWpr} style={{ padding: '0 10px' }}>
        <h3>
          {this.context.address
            ? formatMessage({ id: 'your-liquiditor-mining-rewards' })
            : formatMessage({ id: 'liquiditor-mining-rewards' })}
        </h3>
        <p>{formatMessage({ id: 'get-compensated-when-insurance-fund-is-empty' })}</p>
        <Row>
          {isBSC ? (
            <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>
                <Placeholder loading={loading} width={'6em'}>
                  {format(campaign)} SLD
                </Placeholder>
              </span>
              <span>Campaign Rewards</span>
            </Col>
          ) : null}
          <Col xs={24} sm={24} md={isBSC ? 12 : 24} className={styles.col}>
            <span className={styles.ads}>
              <Placeholder loading={loading}>{format(compensate)} SLD</Placeholder>
            </span>
            <span>{formatMessage({ id: 'compensate-rewards' })}</span>
          </Col>
        </Row>
        <Auth>
          <p className={styles.wantoBe}>{formatMessage({ id: 'want-to-become-liquiditor' })}</p>
          <Button
            type="primary"
            className={styles.redBtn}
            onClick={() => {
              message.info(formatMessage({ id: 'coming-soon' }));
            }}
          >
            {formatMessage({ id: 'read-docs' })}
          </Button>
        </Auth>
      </div>
    );
  }
}
