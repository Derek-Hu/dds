import { Row, Col } from "antd";
import styles from "./style.module.less";

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
            <Row>
                <Col span={8}></Col>
                <Col span={16}>
                    <h3>What is DDerivatives</h3>
                    <p className={styles.advantage}>A High-availability Decentralized Protocol For Trading Perpetual With No Position Loss On Ethereum.</p>
                    <p className={styles.desc}>Centralized exchanges offer strong liquidity and products, but at the expense of user control .Decentralized exchanges give control to users, but compromise on usability.</p>
                </Col>
            </Row>
      </div>
    </div>
  );
};
