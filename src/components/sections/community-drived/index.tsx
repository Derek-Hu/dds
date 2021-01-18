import React from "react";
import { Carousel, Avatar } from "antd";
import styles from "./style.module.less";
import SectionTitle from "../section-title/index";
import SiteContext from "../../../layouts/SiteContext";

const datasource = [
  {
    name: "Roger Spears",
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description:
      "Welcome anyone who wants to promote the evolution and growth of DDeerivatives to join our community.Welcome anyone who wants to promote the evolution and growth of DDeerivatives to join our community.",
  },
  {
    name: "Roger Spears2",
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description: "Welcome anyone who wants to promote the evolution",
  },
];
export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
          <SectionTitle title="We are Community Drived">
            Our community members come from all over the world and share the
            dream of decentralized finance.
          </SectionTitle>
          <Carousel autoplay>
            {datasource.map(({ name, avatar, description }) => (
              <div key={name}>
                <Avatar size={64} src={avatar} />
                <div className={styles.name}>{name}</div>
                <p className={styles.description}>{description}</p>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
