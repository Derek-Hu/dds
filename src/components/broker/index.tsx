import { Component } from "react";
import { Icon, Tabs, Row, Col, Input } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import Step from "./steps";
import ReferalDetails, { IData } from "./referal-details";

const { TabPane } = Tabs;

const tabName = {
  spark: "spark",
  referal: "referral",
};
const adsData = {
  contry: "20+",
  sparks: 124,
  invitations: 9824,
  bonus: 98247489,
};

const url = "http://www.dds.com/home/78998d798";

const referalInfo = {
  referrals: 9824,
  bonus: 98247489,
};

const data: IData[] = [
  {
    bonus: 3243,
    fee: 100,
    address: "0xfs328xkdfwr23rew9328320",
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 10320,
    address: "0xfs328xkdfwr23rew9328320",
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 100,
    address: "0xfs328xkdfwr23rew9328320",
    time: new Date().getTime(),
  },
  {
    bonus: 3243,
    fee: 100,
    address: "0xfs328xkdfwr23rew9328320",
    time: new Date().getTime(),
  },
];
export default class Broker extends Component {
  state = {
    selectedTab: tabName.spark,
  };
  componentDidMount() {}

  callback = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <h2>Broker</h2>
        <div className={styles.referalInfo}>
          <Input value={url} disabled={true} className={styles.input} />
          <span className={styles.btn}>Copy referral link</span>
          <div className={styles.qrcode}>
            <Icon type="qrcode" style={{ fontSize: 32 }} />
          </div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs activeKey={this.state.selectedTab} onChange={this.callback}>
            <TabPane
              tab={<span className={styles.uppercase}>spark program</span>}
              key={tabName.spark}
            >
              <h3>Become DDerivatives’s Spark</h3>
              <p className={styles.descOne}>
                Spread DeFi Spark To The Old World Make Your Influence Into
                Affluence
              </p>
              <div className={styles.percentage}>40%</div>
              <p className={styles.descTwo}>Settlements Fee Commission</p>
              <Row className={styles.tabSpark}>
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
              key={tabName.referal}
            >
              <h3 className={styles.referalTitle}>Summary</h3>
              <Row>
                <Col span={12} className={styles.col}>
                  <span className={styles.ads}>{referalInfo.referrals}</span>
                  <span>Referrals</span>
                </Col>
                <Col span={12} className={styles.col}>
                  <span className={styles.ads}>{referalInfo.bonus}</span>
                  <span>Bonus(DDS)</span>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        {this.state.selectedTab === tabName.spark ? (
          <Step />
        ) : (
          <ReferalDetails data={data} />
        )}
      </div>
    );
  }
}
