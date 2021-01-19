import { Descriptions } from "antd";
import styles from "./style.module.less";
import SiteContext from "../../layouts/SiteContext";

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
          <h2>Info</h2>
          <div className={styles.card}>
            <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
              <Descriptions.Item label="Ticker Root" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Expiry Date" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Settlements Fee Rate" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Forced Liquidation Rate" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Type" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Exercise" span={24}>
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Funding Rate" span={24}>
                Cloud Database
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
