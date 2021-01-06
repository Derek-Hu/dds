import "react";
import { Carousel, Avatar } from "antd";
import styles from './style.module.less';

const datasource = [
  {
    name: "Roger Spears",
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description: "Welcome anyone who wants to promote the evolution and growth of DDeerivatives to join our community.Welcome anyone who wants to promote the evolution and growth of DDeerivatives to join our community.",
  },
  {
    name: "Roger Spears2",
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description: "Welcome anyone who wants to promote the evolution",
  },
];
export default () => {
  return (
    <div className={styles.root}>
      <h3>We are Community Drived</h3>
      <p>
        Our community members come from all over the world and share the dream
        of decentralized finance.
      </p>
      <Carousel effect="fade">
        {datasource.map(({ name, avatar, description }) => (
          <div key={name}>
            <Avatar size={64} src={avatar} />
            <div  className={styles.name}>{name}</div>
            <p  className={styles.description}>{description}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
