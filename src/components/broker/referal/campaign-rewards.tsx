import { Component } from 'react';
import { format } from '../../../util/math';
import SiteContext, { ISiteContextProps } from '../../../layouts/SiteContext';
import { getBrokerCampaignRewardData } from '../../../services/broker.service';
import styles from './campaign-rewards.module.less';
import Placeholder from '../../placeholder';
import { Table } from 'antd';
import ModalRender from '../../modal-render';
import ColumnConvert from '../../column-convert';
import { formatTime } from '../../../util/time';

const CommissionColumns = ColumnConvert<IBrokerCampaignRecord, {}>({
  column: {
    time: 'Time',
    pair: 'Friend Address',
    amount: 'Amount',
    price: 'Settlement Fee',
    reward: 'Commission',
  },
  render(value, key, record) {
    switch (key) {
      case 'time':
        return formatTime(value);
      case 'pair':
        const { from, to } = record[key];
        return from + '/' + to;
      case 'amount':
      case 'price':
      case 'reward':
        return format(value);
      default:
        return value;
    }
  },
});

export default class CampaignRewards extends Component {
  state = {
    isLoading: true,
    rewardAmount: {
      DAI: 0,
      USDT: 0,
      USDC: 0,
    },
    recordsVisible: false,
  };

  public componentDidMount = () => {
    this.loadRewardAmount();
  };

  private loadRewardAmount() {
    getBrokerCampaignRewardData().then((coinItems: ICoinItem[]) => {
      const reducer = (amount: any, item: ICoinItem) => {
        amount[item.coin] = item.amount;
        return amount;
      };
      const rewardAmount = coinItems.reduce(reducer, {});

      this.setState({ rewardAmount, isLoading: false });
    });
  }

  public setModelVisible = (visible: boolean) => {
    this.setState({ recordsVisible: visible });
  };

  render() {
    const rs = (
      <SiteContext.Consumer>
        {({ isMobile }: ISiteContextProps) => {
          const rootClassName = [styles.root, isMobile ? styles.mobile : ''].join(' ');

          const card = (
            <div className={rootClassName}>
              <h2 className={styles.title}>Campaign Rewards</h2>

              <div className={styles.content}>
                <div className={styles.coinValue}>
                  <span className={styles.label}>DAI</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.DAI)}
                    </Placeholder>
                  </span>
                </div>
                <div className={styles.coinValue}>
                  <span className={styles.label}>USDT</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.USDT)}
                    </Placeholder>
                  </span>
                </div>
                <div className={styles.coinValue}>
                  <span className={styles.label}>USDC</span>
                  <span className={styles.val}>
                    <Placeholder width={'100%'} loading={this.state.isLoading}>
                      {format(this.state.rewardAmount.USDC)}
                    </Placeholder>
                  </span>
                </div>
              </div>

              <div className={styles.rewardRecord}>
                <span onClick={() => this.setModelVisible(true)}>Rewards Record</span>
              </div>
            </div>
          );

          return (
            <div>
              {card}
              <ModalRender
                visible={this.state.recordsVisible}
                title="Rewards Record"
                className={styles.modal}
                height={420}
                onCancel={() => this.setModelVisible(false)}
                footer={null}
              >
                <Table scroll={{ y: 300, x: 500 }} columns={CommissionColumns} pagination={false} dataSource={[]} />
              </ModalRender>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );

    return rs;
  }
}
