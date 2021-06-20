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
  private pieContainer: HTMLDivElement | null = null;
  private sizeObserver: ResizeObserver | null = null;

  updateShareData(percent: number) {
    this.pieContainer = document.getElementById(this.containerId) as HTMLDivElement;

    if (this.pieContainer !== null) {
      this.pieInstance = echarts.init(this.pieContainer);
      this.listenContainerSize();
    }

    if (this.pieInstance) {
      this.pieInstance.setOption(shareOption(percent));
    }
  }

  componentDidMount() {
    this.loadPercentage();
  }

  componentWillUnmount() {
    if (this.sizeObserver) {
      this.sizeObserver.disconnect();
      this.sizeObserver = null;
    }
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

  private listenContainerSize() {
    if (this.pieContainer && !this.sizeObserver) {
      this.sizeObserver = new ResizeObserver(entries => {
        if (this.pieInstance) {
          this.pieInstance.resize();
        }
      });

      this.sizeObserver.observe(this.pieContainer);
    }
  }

  render() {
    return (
      <SecondaryCard title="Your Liquidity Mining Share">
        <div className={styles.pie} id={this.containerId} />
      </SecondaryCard>
    );
  }
}
