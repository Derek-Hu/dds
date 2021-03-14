import { Component } from 'react';
import { Table, Row, Col } from 'antd';
import styles from './style.module.less';
import numeral from 'numeral';
import SiteContext from '../../layouts/SiteContext';
import columns from './columns';
import { Hidden } from '../builtin/hidden';
import { getNonRisks } from '../../services/home.service';

interface IState {
  loading: boolean;
  nonRisksInfo?: INonRecords;
}

export default class BecomeSpark extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const nonRisksInfo = await getNonRisks();
    this.setState({
      nonRisksInfo,
    });
    this.setState({ loading: false });
  }

  render() {
    const { nonRisksInfo, loading } = this.state;
    const { total, data } = nonRisksInfo || {};
    return (
      <Hidden when={loading}>
        <SiteContext.Consumer>
          {({ isMobile }) => (
            <div className={styles.root}>
              <div className={styles.content}>
                <div className={styles.head}>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} className={styles.col}>
                      <h2>Non-Risk Perpetual</h2>
                    </Col>
                    {isMobile ? null : (
                      <Col xs={24} sm={24} md={24} lg={12} className={[styles.col, styles.summary].join(' ')}>
                        <span>
                          24h trading volumn: <span className={styles.total}>{numeral(total).format('0,0')}</span> USD
                        </span>
                      </Col>
                    )}
                  </Row>
                </div>
                <Table
                  rowKey="coin"
                  columns={columns}
                  scroll={isMobile ? { x: 800 } : undefined}
                  pagination={false}
                  dataSource={data}
                />
              </div>
            </div>
          )}
        </SiteContext.Consumer>
      </Hidden>
    );
  }
}
