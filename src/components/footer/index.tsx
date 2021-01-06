import { Row, Col } from "antd";
import styles from "./style.module.less";
import links from './links';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Row>
          <Col span={8} className={styles.left}>
            <h2>DDerivatives</h2>
            <p>Infrastructure for future derivatives</p>
          </Col>
          <Col span={16} className={styles.right}>
            <div>
            {
              Object.keys(links).map(category => <Row className={styles.row}>
                <Col span={4} className={styles.category}>{category}</Col>
                <Col span={18}>{
                  (links[category]).map(({link, name, icon}) => <a className={icon ? styles.icon : styles.link} href={link}>{name || icon}</a>)
                }</Col>
              </Row>)
            }
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
