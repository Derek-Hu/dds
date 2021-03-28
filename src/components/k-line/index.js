import React, { Component } from 'react';
// import echarts from "echarts/lib/echarts";
import styles from './style.module.less';
import option, { seryName } from './option';
// import MockData from './mock';
import dayjs from 'dayjs';
import { Select, Row, Col, Button } from 'antd';
import SiteContext from '../../layouts/SiteContext';
import { getPriceGraphData } from '../../services/trade.service';
import { format, isNumberLike } from '../../util/math';
import Coin1 from '~/assets/imgs/coin1.png';
import Coin2 from '~/assets/imgs/coin2.png';

const { Option } = Select;

const echarts = window.echarts;

const Rule = {
  day: 'HH:mm',
  week: 'MM-DD',
  month: 'MM/DD',
};

const Durations = {
  day: '24 Hours',
  week: '1W',
  month: '1M',
};

const sig = value => {
  if (isNumberLike(value)) {
    const val = parseFloat(value);
    return val > 0 ? '+' : val < 0 ? '-' : '';
  }
  return '';
};
export default class MainLayout extends Component {
  ref = React.createRef();

  timer = null;

  state = {
    duration: 'day',
    from: 'ETH',
    to: 'DAI',
  };

  chartInstance = null;

  loadGraph = async (from, to, duration) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const graphData = await getPriceGraphData({ from, to }, duration).catch(() => ({}));

    this.timer = setTimeout(() => {
      this.loadGraph(from, to, duration);
    }, 5000);

    const { data } = graphData || {};
    if (!data || !data.length) {
      return;
    }
    this.setState({
      graphData,
      price: graphData.price,
    });

    if (!this.chartInstance) {
      const container = document.getElementById('k-line');
      // eslint-disable-next-line
      this.chartInstance = echarts.init(container);
      this.chartInstance.setOption(option);
    }
    const { xData, yData } = data.reduce(
      (all, { timestamp, value }) => {
        all.xData.push(dayjs(timestamp).format(Rule[duration]));
        all.yData.push(value);
        return all;
      },
      { xData: [], yData: [] }
    );

    this.chartInstance.setOption({
      grid: {
        left: '30px',
        right: '30px',
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: Math.floor(xData.length / 4),
          showMaxLabel: true,
        },
      },
      yAxis: {
        // min: duration === 'day' ? 1600 : 1200,
        min: Math.min.apply(null, yData),
      },
      series: [
        {
          // 根据名字对应到相应的系列
          name: seryName,
          data: yData,
        },
      ],
    });

    this.chartInstance.getZr().on('mousemove', params => {
      const pointInPixel = [params.offsetX, params.offsetY];
      if (this.chartInstance.containPixel('series', pointInPixel)) {
        let xIndex = this.chartInstance.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
        this.setState({
          price: yData[xIndex],
        });
      }
    });
    this.chartInstance.getZr().on('mouseout', () => {
      this.setState({
        price: graphData.price,
      });
    });
  };
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  async componentDidMount() {
    const { from, to } = this.props;
    const { duration } = this.state;

    this.setState({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
    });

    this.loadGraph(from, to, duration);
  }

  changeDuration = key => {
    const { from, to } = this.state;
    this.setState({
      duration: key,
    });
    this.loadGraph(from, to, key);
  };
  render() {
    const { from, to, graphData, duration, price } = this.state;
    const { percentage, range } = graphData || {};
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => {
          const width = isMobile ? window.innerWidth - 32 : '100%';
          return (
            <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
              <div className={styles.headArea}>
                <img src={Coin1} alt="" width="26px" style={{ position: 'relative', right: '-4px' }} />
                <img src={Coin2} alt="" width="26px" />
                <Select defaultValue="ETH/DAI" style={{ width: 120 }}>
                  <Option value="ETH/DAI">ETH/DAI</Option>
                  <Option value="ETH/USDT" disabled>
                    ETH/USDT
                  </Option>
                  <Option value="ETH/USDC" disabled>
                    ETH/USDC
                  </Option>
                  <Option value="WBTC/DAI" disabled>
                    WBTC/DAI
                  </Option>
                  <Option value="WBTC/USDT" disabled>
                    WBTC/USDT
                  </Option>
                  <Option value="WBTC/USDC" disabled>
                    WBTC/USDC
                  </Option>
                </Select>
              </div>
              <Row type="flex" justify="space-between" align="middle">
                <Col xs={24} sm={24} md={12} lg={12} className={styles.currPrice}>
                  <div className={styles.currVal}>{format(price)} USD</div>
                  {/* <p className={styles.change}>
                    {sig(range)}
                    {format(range)} {to}({sig(percentage)}
                    {format(percentage)}%) <span>Past {Durations[duration]}</span>
                  </p> */}
                </Col>
                <Col className={styles.range} xs={24} sm={24} md={12} lg={12}>
                  {Object.keys(Durations).map(key => (
                    <Button
                      key={key}
                      onClick={() => this.changeDuration(key)}
                      className={key === duration ? styles.current : ''}
                      type="link"
                    >
                      {Durations[key]}
                    </Button>
                  ))}
                </Col>
              </Row>

              <div id="k-line" style={{ width: width, margin: '0', height: '400px' }}></div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
