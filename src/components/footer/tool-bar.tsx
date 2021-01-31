import { Component } from "react";
import { Menu, Icon, Row, Col, Button, Dropdown } from "antd";
import styles from "./style.module.less";
import ConnectWallet from "../connect-wallet/index";
import { Link, Redirect } from "react-router-dom";
import { link } from "fs";


const rightMenus : {[key: string]: string } = {
    Analytics: "/home",
    Support: '/support',
    Whitepaper: "/Whitepaper",
    FAQ: "/faq",
    "Developer Docs": "/docs",
    API: "/api",
    Github: "/github",
    Twitter: "/Twitter",
    Reddit: "/Reddit",
    "DDerivatives DAO": "/dao",
    Vote: "/vote",
  };

const menu = (
  <Menu mode="horizontal">
      {
          Object.keys(rightMenus).map(linkName => <Menu.Item key={linkName}>
          <Link to={(rightMenus[linkName])} >
            {linkName}
          </Link>
        </Menu.Item>)
      }
  </Menu>
);
export default () => {
  return (
    <div className={styles.toolBar}>
      <Row type="flex" justify="space-between" align="middle">
        <Col span={12}>
          <ConnectWallet>
            <Button type="link">Connect Wallet</Button>
          </ConnectWallet>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Dropdown overlay={menu} trigger={['click']} placement="topRight">
            <Icon type="ellipsis" />
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
};