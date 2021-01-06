import React from "react";
import styles from "./style.module.less";
import SectionTitle from "../section-title/index";
import { Icon } from "antd";

const style = { color: "#A8B0BB", fontSize: 38 };

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
];
export default () => {
  return (
    <div className={styles.root}>
      <SectionTitle title="Contact DDerivatives">
        Welcome anyone who wants to promote the evolution and growth of
        DDeerivatives to join our community.
      </SectionTitle>
      <ul>
        {links.map(({ icon, url }, index) => (
          <li key={index}>
            <a href={url}>{icon}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
