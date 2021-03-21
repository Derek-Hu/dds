export const seryName = 'Price';

export default {
  grid: {
    left: 10,
    right: 10,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      animation: false,
      type: 'cross',
      lineStyle: {
        color: '#003FE6',
      },
    },
    showContent: false,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    show: false,
    boundaryGap: [0, '5%'],
    min: 1200,
  },
  series: [
    {
      name: seryName,
      type: 'line',
      smooth: true,
      sampling: 'average',
      // symbolSize: 10,
      showSymbol: false,
      itemStyle: {
        color: '#1346FF',
        borderColor: '#1346FF',
      },
      lineStyle: {
        width: 1,
        opacity: 0.8,
        color: '#1346ff',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(19,70,255,0.15)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(19,70,255, 0)', // 100% 处的颜色
            },
          ],
        },
      },
      data: [],
    },
  ],
};
