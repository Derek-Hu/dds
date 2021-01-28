import { Button, Row, Col, Icon } from "antd";
import styles from "./style.module.less";
import SiteContext from "../../layouts/SiteContext";

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
          <div className={styles.content}>
            <h2>
              The world's first <br />
              Decentralized Non-Risk Perpetual Exchange
            </h2>
            <Button className={styles.spot}>Spot Trading</Button>
            {isMobile ? null : (
              <Button className={styles.read} type="link">
                Read the docs
              </Button>
            )}
          </div>
        </div> 
      )}
    </SiteContext.Consumer>
  );
};

