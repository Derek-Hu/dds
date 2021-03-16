import { Component } from 'react';
import { Table, Row, Col } from 'antd';
import styles from './style.module.less';
import { format, isNumberLike } from '../../util/math';
import SiteContext from '../../layouts/SiteContext';
import { Hidden } from '../builtin/hidden';
import { getNonRisks } from '../../services/home.service';
import ColumnConvert from '../column-convert/index';

interface IState {
  loading: boolean;
  nonRisksInfo?: INonRecords | null;
}

export default class BecomeSpark extends Component<any, IState> {
  state: IState = {
    loading: false,
  };

  columns = ColumnConvert<INonRiskPerpetual, { coin: any; action: any }>({
    column: {
      coin: 'Coin',
      price: <span className={styles.price}>Last Price</span>,
      change: <span className={styles.change}>24h Change</span>,
      // chart: "Chart",
      action: 'Action',
    },
    render: (value, key, record) => {
      switch (key) {
        case 'coin':
          return (
            <span>
              <span className={styles.coin}>{record.fromCoin}</span>
              <span className={styles.usdt}> / {record.toCoin}</span>
            </span>
          );
        case 'price':
          return <span className={styles.priceVal}>{value}</span>;
        case 'change':
          return (
            <span className={[styles.changeVal, value < 0 ? styles.negative : ''].join(' ')}>
              {value > 0 ? '+' : ''}
              {value}%
            </span>
          );
        case 'action':
          return (
            <span
              className={styles.tradeBtn}
              onClick={() =>
                this.gotoTrade({
                  fromCoin: record.fromCoin,
                  toCoin: record.toCoin,
                })
              }
            >
              Trade
            </span>
          );
        default:
          return value;
      }
    },
  });

  gotoTrade = ({ fromCoin, toCoin }: { fromCoin: string; toCoin: string }) => {
    this.props.history.push({
      pathname: '/trade',
      search: `?from=${fromCoin}&to=${toCoin}`,
    });
  };
  async componentDidMount() {
    this.setState({ loading: true });
    const nonRisksInfo = await getNonRisks().catch(() => null);
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
                      <h2>Risk-free Perpetual Contract</h2>
                    </Col>
                    {isMobile ? null : isNumberLike(total) ? (
                      <Col xs={24} sm={24} md={24} lg={12} className={[styles.col, styles.summary].join(' ')}>
                        <span>
                          24h Volume: <span className={styles.total}>{format(total)}</span> USD
                        </span>
                      </Col>
                    ) : null}
                  </Row>
                </div>
                <Table
                  rowKey="coin"
                  columns={this.columns}
                  scroll={isMobile ? { x: 800 } : undefined}
                  pagination={false}
                  dataSource={data || []}
                />
              </div>
            </div>
          )}
        </SiteContext.Consumer>
      </Hidden>
    );
  }
}
