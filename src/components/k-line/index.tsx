import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import { EChartsFullOption } from "echarts/lib/option";
import styles from './style.module.less';

export default class MainLayout extends Component {
  ref = React.createRef<HTMLElement>();

  componentDidMount() {
    const container = document.getElementById("k-line");

    var myChart = echarts.init(container!);

    var option: EChartsFullOption = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    myChart.setOption(option);
  }
  render() {
    return (
      <div className={styles.root} id="k-line">
        <div id="main" style={{width: '600px', height:'400px'}}></div>
      </div>
    );
  }
}
