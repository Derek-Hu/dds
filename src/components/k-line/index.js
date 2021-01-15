import React, { Component } from "react";
// import echarts from "echarts/lib/echarts";
import styles from "./style.module.less";
import option, { seryName } from "./option";
import MockData from "./mock";

const echarts = window.echarts;
export default class MainLayout extends Component {
  ref = React.createRef();

  componentDidMount() {
    const container = document.getElementById("k-line");

    // eslint-disable-next-line
    var myChart = echarts.init(container);

    myChart.setOption(option);

    setTimeout(() => {
      myChart.setOption({
        xAxis: {
          data: MockData[0],
        },
        series: [
          {
            // 根据名字对应到相应的系列
            name: seryName,
            data: MockData[1],
          },
        ],
      });
    }, 2000);
  }
  render() {
    return (
      <div className={styles.root}>
        <div id="k-line" style={{ width: "100%", height: "400px" }}></div>
      </div>
    );
  }
}
