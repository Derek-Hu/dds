import { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import styles from '../style.module.less';
import { format } from '../../../util/math';
import { getLiquiditorReward } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';
import Placeholder from '../../placeholder/index';

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
        <h3>{this.context.address ? 'Your Liquiditor Mining Rewards' : 'Liquiditor Mining Rewards'}</h3>
        <p>Get compensated when insurance fund is empty</p>
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
            <span>Compensate Rewards</span>
          </Col>
        </Row>
        <Auth>
          <p className={styles.wantoBe}>Want to become a liquiditor?</p>
          <Button
            type="primary"
            className={styles.redBtn}
            onClick={() => {
              message.info('coming soon');
            }}
          >
            READ DOCS
          </Button>
        </Auth>
      </div>
    );
  }
}
