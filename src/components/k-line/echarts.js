var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 300];

for (var i = 1; i < 20000; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.abs(Math.round((Math.random() - 0.5) * 20 + data[i - 1])));
}

option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: '大数据量面积图',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none',
                
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: 'value',
        show:false,
        boundaryGap: [0, '5%']
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10,
        minSpan: 0.1
    }],
    series: [
        {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: '#ffacac',
 
            },
            areaStyle: {
                color: {
                    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: 'rgba(255, 102, 102,0.15)' // 0% 处的颜色
    }, {
        offset: 1, color: 'rgba(255, 102, 102, 0)' // 100% 处的颜色
    }],
                }
            },
            data: data
        }
    ]
};
