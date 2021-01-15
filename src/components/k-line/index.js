import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import styles from "./style.module.less";
import option, { seryName } from "./option";
import MockData from "./mock";
export default class MainLayout extends Component {
  ref = React.createRef();

  componentDidMount() {
    const container = document.getElementById("k-line");

    // eslint-disable-next-line
    var myChart = echarts.init(container);

    myChart.setOption({
      title: {
        left: "center",
        text: "大数据量面积图",
      },
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: "value",
        show: false,
        boundaryGap: [0, "5%"],
      },
      series: [
        {
          name: seryName,
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "#ffacac",
          },
          areaStyle: {
            // eslint-disable-next-line
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(255, 102, 102,0.15)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(255, 102, 102, 0)", // 100% 处的颜色
                },
              ],
            },
          },
          data: [],
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 10,
          minSpan: 0.1,
        },
      ],
    });

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
        <div id="k-line" style={{ width: "600px", height: "400px" }}></div>
      </div>
    );
  }
}
