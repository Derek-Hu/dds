import { Component } from 'react';
import { Button, Row, Col } from 'antd';
import styles from '../style.module.less';
import { format } from '../../../util/math';
import { getLiquiditorReward } from '../../../services/mining.service';
import { Hidden } from '../../builtin/hidden';
import SiteContext from '../../../layouts/SiteContext';
import Auth, { Public } from '../../builtin/auth';

interface IState {
  loading: boolean;
  data?: { campaign: number; compensate: number };
}
export default class LiquiditorReward extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  static contextType = SiteContext;

  async componentDidMount() {
    this.setState({ loading: true });
    const data = await getLiquiditorReward(this.context.account ? 'private' : 'public');
    this.setState({
      data,
    });
    this.setState({ loading: false });
  }

  showClaimModal = () => {};

  render() {
    const { data, loading } = this.state;
    const { campaign, compensate } = data || {};
    return (
      <Hidden when={loading}>
        <div className={styles.liquiditorWpr}>
          <h3>{this.context.account ? 'Your Liquiditor Mining Rewards' : 'Liquiditor Mining Rewards'}</h3>
          <p>Win the liquiditor Campaign or get compensated when fund is empty</p>
          <Row>
            {/* <Col xs={24} sm={24} md={12} lg={12} className={styles.col}>
              <span className={styles.ads}>{campaign} SLD</span>
              <span>Campaign Rewards</span>
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={24} className={styles.col}>
              <span className={styles.ads}>{compensate} SLD</span>
              <span>Compensate Rewards</span>
            </Col>
          </Row>
          <Auth>
            <p className={styles.wantoBe}>Want to become a liquiditor?</p>
            <Button type="primary">Read Liquiditor Docs</Button>
          </Auth>
        </div>
      </Hidden>
    );
  }
}
