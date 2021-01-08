import React from "react";
import styles from "./style.module.less";
import SectionTitle from "../section-title/index";
import { Icon, Row, Col } from "antd";

const style = { color: "#A8B0BB", fontSize: 60, marginTop: "70px" };

// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
// });

const links = [
  {
    icon: <Icon type="twitter" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="instagram" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="facebook" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="medium" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="github" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
  {
    icon: <Icon type="github" style={style} />,
    url: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  },
];
export default () => {
  return (
    <div className={styles.root}>
      <SectionTitle title="Contact DDerivatives" noMarginBottom>
        Welcome anyone who wants to promote the evolution and growth of
        DDeerivatives to join our community.
      </SectionTitle>
      <Row type="flex" justify="center">
        {links.map(({ icon, url }, index) => (
          <Col key={index} xs={8} sm={8} md={3} lg={2}>
            <a href={url}>{icon}</a>
          </Col>
        ))}
      </Row>
    </div>
  );
};
