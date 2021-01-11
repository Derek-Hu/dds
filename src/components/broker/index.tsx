import { Component } from "react";
import { Icon, Tabs, Row, Col, Input } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";

const { TabPane } = Tabs;

const adsData = {
  contry: "20+",
  sparks: 124,
  invitations: 9824,
  bonus: 98247489,
};

const url = "http://www.dds.com/home/78998d798";

export default class Broker extends Component {
  componentDidMount() {}

  callback(key: string) {
    console.log(key);
  }

  render() {
    return (
      <div className={styles.root}>
        <h2>Broker</h2>
        <div className={styles.referalInfo}>
          <Input value={url} disabled={true} className={styles.input} />
          <span className={styles.btn}>Copy referral link</span>
          <div className={styles.qrcode}>
            <Icon
              type="qrcode"
              style={{ fontSize: 32 }}
            />
          </div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs defaultActiveKey="spark" onChange={this.callback}>
            <TabPane
              tab={<span className={styles.uppercase}>spark program</span>}
              key="spark"
            >
              <h3>Become DDerivatives’s Spark</h3>
              <p className={styles.descOne}>
                Spread DeFi Spark To The Old World Make Your Influence Into
                Affluence
              </p>
              <div className={styles.percentage}>40%</div>
              <p className={styles.descTwo}>Settlements Fee Commission</p>
              <Row>
                <Col span={6} className={styles.col}>
                  <span className={styles.ads}>{adsData.contry}</span>
                  <span>Countries</span>
                </Col>
                <Col span={6} className={styles.col}>
                  <span className={styles.ads}>{adsData.sparks}</span>
                  <span>Sparks</span>
                </Col>
                <Col span={6} className={styles.col}>
                  <span className={styles.ads}>{adsData.invitations}</span>
                  <span>Invitations</span>
                </Col>
                <Col span={6}>
                  <span className={styles.ads}>
                    {numeral(adsData.bonus).format("0,0")}
                  </span>
                  <span>Bonus(DDS)</span>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={<span className={styles.uppercase}>My referral</span>}
              key="referral"
            ></TabPane>
          </Tabs>
        </div>
        <div className={styles.steps}>
          <h4>Simple Steps</h4>
          <Row>
            <Col span={8}>
              <Icon type="form" />
              <p>1. Invite Friends</p>
              <div>
                Invite friends to DDerivatives through the referral link or
                invitation code
              </div>
            </Col>
            <Col span={8}>
              <Icon type="line-chart" />
              <p>2. Your Friends Open First Order</p>
              <div>
                Invite friends to DDerivatives through the referral link or
                invitation code
              </div>
            </Col>
            <Col span={8}>
              <Icon type="fund" />
              <p>3. Receive Your DDS Bonus</p>
              <div>Instantly get your bonus as DDS</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
