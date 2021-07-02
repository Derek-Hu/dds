import { Component } from 'react';
import { Row, Col, Table, Icon, Button } from 'antd';
import styles from './system-ranking.module.less';
import SiteContext from '../../layouts/SiteContext';
// import Pool, { IPool } from '../liquidity-pool/pool';
import { getRankings } from '../../services/mining.service';
import { shortAddress } from '../../util/index';
import Placeholder from '../placeholder/index';

// const PublicProvidedPool: IPool = {
//   title: 'System Fund Balance',
//   usd: 748830,
//   coins: [
//     {
//       label: 'DAI',
//       value: 647,
//     },
//     {
//       label: 'USDC',
//       value: 638,
//     },
//     {
//       label: 'USDT',
//       value: 7378,
//     },
//   ],
// };

interface IState {
  loading: boolean;
  rankings: IRankings | null;
}

export default class Ranking extends Component<any, IState> {
  UNSAFE_componentWillReceiveProps() {
    this.loadData();
  }

  state: IState = {
    loading: false,
    rankings: null,
  };

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.setState({
      loading: true,
    });
    try {
      const rankings = await getRankings();
      this.setState({
        rankings,
      });
    } catch {}
    this.setState({
      loading: false,
    });
  }

  render() {
    const { rankings, loading } = this.state;
    const { top, current } = rankings || {};

    return (
      <SiteContext.Consumer>
        {({ address }) => (
          <Row gutter={address ? 0 : 12}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={styles.rankings}>
                <h3>Liquiditor Ranking</h3>
                <div className={styles.blocks}>
                  {[0, 1, 2].map(idx => (
                    <div key={idx}>
                      <span>{idx + 1}</span>
                      <span>
                        <Placeholder noWrp={true} loading={loading && !!top && !!top.length}>
                          {top ? shortAddress(top![idx]) : <span>&nbsp;</span>}
                        </Placeholder>
                      </span>
                    </div>
                  ))}
                </div>
                {address ? (
                  <Placeholder noWrp={true} loading={loading} style={{ margin: '63px auto' }} width="50%">
                    <p className={styles.current}>
                      {current !== undefined && current > 0 && current < 4 ? (
                        <span>
                          You are at <span>NO.{current}</span>
                        </span>
                      ) : current === 0 ? (
                        <span>You are not yet the liquidator</span>
                      ) : current === 4 ? (
                        <span>You are not in the top 3</span>
                      ) : (
                        ''
                      )}
                    </p>
                  </Placeholder>
                ) : (
                  <p>Connect wallet to see your ranking</p>
                )}
              </div>
            </Col>
            {/* <Col xs={24} sm={24} md={12} lg={12}>
              {children}
            </Col> */}
          </Row>
        )}
      </SiteContext.Consumer>
    );
  }
}
