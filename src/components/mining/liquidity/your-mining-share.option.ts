import { EChartOption } from 'echarts';

export function shareOption(yourShare: number): EChartOption {
  const displayYourShare = yourShare > 0 && yourShare < 1 ? 1 : yourShare;
  const displayOtherShare = 100 - displayYourShare;
  const yourShareName = 'Your Share';
  const otherUserName = 'Other Users';

  return {
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: ((
        data: EChartOption.Tooltip.Format,
        ticket: string,
        callback: (ticket: string, html: string) => void
      ) => {
        if (data?.name === yourShareName) {
          return `Your Share is ${yourShare.toFixed(2)}%`;
        } else {
          return `Other Users' Share`;
        }
      }) as EChartOption.Tooltip.Formatter,
    },
    color: ['#1346FF', '#dddddd'],
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'your share in pool',
        type: 'pie',
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
          { value: displayYourShare, name: yourShareName, color: ['#ff0000'] },
          { value: displayOtherShare, name: otherUserName, color: ['#ff0000'] },
        ],
      },
    ],
  };
}
