import { Icon, Row, Col } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import Bar from './bar';

const percentages = {
  center: 30,
};
export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => {
        const rect = isMobile
          ? {
              width: 350,
              height: 200,
              barHeight: 80,
              bar: 100,
              center: 80,
            }
          : {
              width: 750,
              height: 200,
              barHeight: 80,
              bar: 200,
              center: 140,
            };
        const leftCenter = (rect.width - 2 * rect.bar - rect.center) / 2 + rect.bar;
        const gap = (rect.width - 2 * rect.bar - rect.center) / 2;
        return (
          <div className={[styles.steps, isMobile ? styles.mobile : ''].join(' ')}>
            <h4>Simple Steps</h4>
            <Row>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Icon type="form" />
                <p>1. Invite Friends</p>
                <div>Invite friends to DDerivatives through the referral link or invitation code</div>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Icon type="line-chart" />
                <p>2. Your Friends Open First Order</p>
                <div>Invite friends to DDerivatives through the referral link or invitation code</div>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Icon type="fund" />
                <p>3. Receive Your DDS Bonus</p>
                <div>Instantly get your bonus as DDS</div>
              </Col>
            </Row>
            <div>
              <h4>Level & Commission</h4>
              <p>due to the ranking of the network we have 4 level for broker</p>
              <Row>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <p className={styles.themeColor}>A</p>
                  <div>
                    Top 20
                    <br /> 40%
                  </div>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <p className={styles.themeColor}>B</p>
                  <div>
                    Top 21 - 50
                    <br /> 40%
                  </div>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <p className={styles.themeColor}>C</p>
                  <div>
                    Top 50 - 100
                    <br /> 30%
                  </div>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                  <p className={styles.themeColor}>D</p>
                  <div>
                    &gt;100
                    <br /> 20%
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.campionLevels}>
              <h4>Campaign</h4>
              <p>
                不同等级的返佣率不同，C、D等级将分别拿出10%和20%的手续费注入奖励池。
                每30天奖励池的60%和40%的奖励将被均分给等级A、B的经纪人， 并基于最新的排名重置等级。
              </p>
              <div>
                <div className={styles.title}>
                  <span>Commission Rate</span>
                  <span>Rewards Pool</span>
                  <span>Commission Rate</span>
                </div>
                <div className={styles.container} style={{ width: rect.width + 'px', height: rect.height + 'px' }}>
                  <Bar percentage={40} width={rect.bar} />
                  <Bar percentage={40} width={rect.bar} />
                  <Bar
                    percentage={percentages.center}
                    style={{ left: leftCenter + 'px' }}
                    width={rect.center}
                    height={rect.height}
                    vertical={true}
                  />
                  <Bar percentage={40} width={rect.bar} right={true} />
                  <Bar percentage={40} width={rect.bar} right={true} />
                  <div className={styles.layers} style={{ width: gap + 'px', left: rect.bar + 'px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height={rect.height} width={gap}>
                      <polygon
                        points={`0,${rect.barHeight} ${gap},${((100 - percentages.center) * rect.height) / 100} 0,${
                          rect.height - rect.barHeight
                        }`}
                        stroke-width="0"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                  <div className={styles.layers} style={{ width: gap + 'px', right: rect.bar + 'px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height={rect.height} width={gap}>
                      <polygon
                        points={`${gap},${rect.barHeight} 0,${
                          ((100 - percentages.center) * rect.height) / 100
                        } ${gap},${rect.height - rect.barHeight}`}
                        stroke-width="0"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                  <div className={styles.categoryLabel}>
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                    <span>D</span>
                  </div>
                </div>
              </div>
              <p>Rewards distribute every 30 days</p>
            </div>
          </div>
        );
      }}
    </SiteContext.Consumer>
  );
};
