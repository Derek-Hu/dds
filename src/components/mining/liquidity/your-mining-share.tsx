import { Component } from 'react';
import { SecondaryCard } from '../../common/card/secondary-card';
import { ECharts } from 'echarts';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';

import { shareOption } from './your-mining-share.option';
import styles from './your-mining-share.module.less';
import { queryLiquidityLockedReTokenShare } from '../../../services/mining.service';

export default class PoolArea extends Component {
  private containerId = 'share-pie';
  private pieInstance: ECharts | null = null;

  updateShareData(percent: number) {
    const container: HTMLElement | null = document.getElementById(this.containerId);
    if (container !== null) {
      this.pieInstance = echarts.init(container as HTMLDivElement);
    }
    if (this.pieInstance) {
      this.pieInstance.setOption(shareOption(percent));
    }
  }

  componentDidMount() {
    this.loadPercentage();
  }

  loadPercentage() {
    queryLiquidityLockedReTokenShare()
      .then((percent: number) => {
        this.updateShareData(percent);
      })
      .catch(err => {
        console.warn('error', err);
      });
  }

  render() {
    return (
      <SecondaryCard title="Your Liquidity Mining Share">
        <div className={styles.pie} id={this.containerId} />
      </SecondaryCard>
    );
  }
}
