import { Row, Col, Table, Icon, Button } from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import styles from "./system-fund-balance.module.less";
import SiteContext from "../../layouts/SiteContext";
import Pool, { IPool } from "../liquidity-pool/pool";


const PublicProvidedPool: IPool = {
  title: "System Fund Balance",
  usd: 748830,
  coins: [
    {
      name: "DAI",
      value: 647,
    },
    {
      name: "USDC",
      value: 638,
    },
    {
      name: "USDT",
      value: 7378,
    },
  ],
};

export default ({isLogin}: {isLogin:boolean}) => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <Row gutter={isMobile? 0: 12}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className={styles.rankings}>
            <h4>Liquiditor Ranking</h4>
            <div className={styles.blocks}>
              <div><span>1</span><span>0x17...589</span></div>
              <div><span>2</span><span>0x17...589</span></div>
              <div><span>3</span><span>0x17...589</span></div>
            </div>
            {
              isLogin ? <p className={styles.current}>
                You are at <span>NO.23/Na</span>
              </p>: <p>Connect wallet to see your ranking</p> 
            }
            
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Pool {...PublicProvidedPool} />
        </Col>
      </Row>
      )}
    </SiteContext.Consumer>
  );
};
