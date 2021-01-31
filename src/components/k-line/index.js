import React, { Component } from "react";
// import echarts from "echarts/lib/echarts";
import styles from "./style.module.less";
import option, { seryName } from "./option";
import MockData from "./mock";
import { Select, Row, Col, Button } from "antd";
import SiteContext from "../../layouts/SiteContext";

const { Option } = Select;

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
      <SiteContext.Consumer>
        {({ isMobile }) => {
          const width = isMobile ? window.innerWidth - 32 : "100%";
          return (
            <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
              <div className={styles.headArea}>
                <Select defaultValue="ETH/DAI" style={{ width: 120 }}>
                  <Option value="ETH/DAI">ETH/DAI</Option>
                  <Option value="ETH/USDT">ETH/USDT</Option>
                  <Option value="ETH/USDC">ETH/USDC</Option>
                  <Option value="BTC/DAI">BTC/DAI</Option>
                  <Option value="BTC/USDT">BTC/USDT</Option>
                  <Option value="BTC/USDC">BTC/USDC</Option>
                </Select>
              </div>
              <Row type="flex" justify="space-between" align="middle">
                <Col xs={24} sm={24} md={12} lg={12} className={styles.currPrice}>
                  <div className={styles.currVal}>174.8727 USDC</div>
                  <p className={styles.change}>
                    -147.2416 USDC(-11.14%) <span>Past 24 Hours</span>
                  </p>
                </Col>
                <Col className={styles.range} xs={24} sm={24} md={12} lg={12}>
                  <Button className={styles.current} type="link">
                    24H
                  </Button>
                  <Button type="link">1W</Button>
                  <Button type="link">1M</Button>
                </Col>
              </Row>

              <div id="k-line" style={{ width: width, margin: '0', height: "400px" }}></div>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
