import { Component } from 'react';
import { Icon, Tabs, Row, Col, Input, Button, Table } from 'antd';
import CardInfo from '../../card-info/index';
import { getBrokerCampaignPool, getBrokerCampaignRewardsPool } from '../../../services/broker.service';
import ModalRender from '../../modal-render/index';
import ColumnConvert from '../../column-convert/index';
import dayjs from 'dayjs';
import styles from '../campion-pool.module.less';
import PoolProgress, { IMiningShare } from '../../progress-bar/pool-progress';
import WithIndicator, { IIndicatorProgress } from '../../progress-bar/with-indicator';
import { percentage } from '../../../util/math';

interface IState {
  data: Array<IIndicatorProgress>;
  loading: boolean;
  nextDistribution?: string;
}

export default class CampaignRewardsPool extends Component<any, IState> {
  state: IState = {
    data: [],
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const { data, nextDistribution } = await getBrokerCampaignPool();
    this.setState({
      data: data.map(({ amount, total, coin }) => ({
        label: coin,
        percentage: percentage(amount, total),
        val: (
          <span>
            {amount}/{total}
          </span>
        ),
      })),
      nextDistribution,
    });
    this.setState({ loading: false });
  }

  render() {
    const { data, loading, nextDistribution } = this.state;
    return loading ? null : (
      <div>
        <PoolProgress
          loading={false}
          totalMode={true}
          title="Campaign Rewards Pool"
          coins={data}
          desc={
            <div>
              <p className="text-center">
                Next distribution time
                <br />
                <span>{nextDistribution}</span>
              </p>
              ,
              <p className={styles.shareTotalTip}>
                <span>
                  Your
                  <br />
                  share
                </span>
                <span>
                  Total
                  <br />
                  Locked
                </span>
              </p>
            </div>
          }
        />
      </div>
    );
  }
}
