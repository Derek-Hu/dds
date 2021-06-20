import { Row, Col, Table, Icon, Button } from 'antd';
import styles from './system-ranking.module.less';
import SiteContext from '../../layouts/SiteContext';
import Pool, { IPool } from '../liquidity-pool/pool';
import { formatMessage } from '~/util/i18n';

const PublicProvidedPool: IPool = {
  title: formatMessage({ id: 'system-fund-balance' }),
  usd: 748830,
  coins: [
    {
      label: 'DAI',
      value: 647,
    },
    {
      label: 'USDC',
      value: 638,
    },
    {
      label: 'USDT',
      value: 7378,
    },
  ],
};

export default ({ isLogin, children }: { children: any; isLogin: boolean }) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <Row gutter={isMobile ? 0 : 12}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className={styles.rankings}>
              <h4>{formatMessage({ id: 'liquiditor-ranking' })}</h4>
              <div className={styles.blocks}>
                <div>
                  <span>1</span>
                  <span>0x17...589</span>
                </div>
                <div>
                  <span>2</span>
                  <span>0x17...589</span>
                </div>
                <div>
                  <span>3</span>
                  <span>0x17...589</span>
                </div>
              </div>
              {isLogin ? (
                <p className={styles.current}>
                  {formatMessage({ id: 'your-ranking-score', ranking: rankingScore }, true)}
                </p>
              ) : (
                <p>{formatMessage({ id: 'connect-wallet-see-ranking' })}</p>
              )}
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            {children}
          </Col>
        </Row>
      )}
    </SiteContext.Consumer>
  );
};
