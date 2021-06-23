import { EChartOption } from 'echarts';

export function shareOption(yourShare: number): EChartOption {
  const displayYourShare = yourShare;
  const displayOtherShare = 100 - displayYourShare;
  const yourShareName = 'Your Share';
  const otherUserName = 'Other Users';

  return {
    tooltip: {
      show: true,
    },
    color: ['#1346FF', '#dddddd'],
    legend: {
      top: '5%',
      left: 'center',
    },

    series: [
      {
        name: '',
        type: 'pie',
        selectedMode: false,
        minAngle: 1,
        animation: false,
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data: [
          {
            value: displayYourShare,
            name: yourShareName,
            tooltip: {
              formatter: (params, ticket, callback) => {
                return 'Your Share: ' + (params as EChartOption.Tooltip.Format).percent + '%';
              },
            },
            emphasis: {
              label: {
                show: false,
              },
            },
          },
          {
            value: displayOtherShare,
            name: otherUserName,
            selected: false,
            tooltip: {
              formatter: (params, ticket, callback) => {
                const percent: number | undefined = (params as EChartOption.Tooltip.Format).percent;
                return percent && percent < 100 ? percent + '%' : 'None Liquidity Mining Share';
              },
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                opacity: 1,
                borderWidth: 0,
              },
            },
          },
        ] as EChartOption.SeriesPie.DataObject[],
      },
    ],
  };
}
