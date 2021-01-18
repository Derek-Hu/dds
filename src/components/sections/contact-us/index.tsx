import React from "react";
import styles from "./style.module.less";
import SectionTitle from "../section-title/index";
import { Icon, Row, Col } from "antd";
import SiteContext from "../../../layouts/SiteContext";

const links = [
  {
    icon: <Icon type="twitter" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="instagram" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="facebook" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="medium" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="github" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="github" />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
];

export default () => (
  <SiteContext.Consumer>
    {({ isMobile }) => (
      <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
        <SectionTitle title="Contact DDerivatives" noMarginBottom>
          Welcome anyone who wants to promote the evolution and growth of
          DDeerivatives to join our community.
        </SectionTitle>
        <Row type="flex" justify="center">
          {links.map(({ icon, url }, index) => (
            <Col key={index} xs={4} sm={8} md={3} lg={2}>
              <a href={url}>{icon}</a>
            </Col>
          ))}
        </Row>
      </div>
    )}
  </SiteContext.Consumer>
);
