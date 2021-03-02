export const seryName = 'klineData';

export default {
  tooltip: {
    trigger: "axis",
    position: function (pt: any) {
      return [pt[0], "10%"];
    },
  },
  // title: {
  //   left: "center",
  //   text: "大数据量面积图",
  // },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: "value",
    show: false,
    boundaryGap: [0, "5%"],
    // boundaryGap: false,
  },
  // dataZoom: [
  //   {
  //     type: "inside",
  //     start: 0,
  //     end: 10,
  //     minSpan: 0.1,
  //   },
  // ],
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
};
