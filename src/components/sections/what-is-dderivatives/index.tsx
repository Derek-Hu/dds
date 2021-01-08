import { Row, Col } from "antd";
import styles from "./style.module.less";

export default () => {
  return (
    <div className={styles.root}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={10} className={styles.imgContainer}>
          <img alt="" src="https://via.placeholder.com/335x210.png" />
        </Col>
        <Col xs={24} sm={24} md={24} lg={14} className={styles.message}>
          <h3>What is DDerivatives</h3>
          <p className={styles.advantage}>
            A High-availability Decentralized Protocol For Trading Perpetual
            With No Position Loss On Ethereum.
          </p>
          <p className={styles.desc}>
            Centralized exchanges offer strong liquidity and products, but at
            the expense of user control .Decentralized exchanges give control to
            users, but compromise on usability.
          </p>
        </Col>
      </Row>
    </div>
  );
};
