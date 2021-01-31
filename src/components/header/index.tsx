import { Component } from "react";
import { Menu, Icon, Row, Col, Button, Drawer } from "antd";
import styles from "./style.module.less";
import { NavLink as Link, Link as LLink } from "react-router-dom";
import SiteContext from "../../layouts/SiteContext";
import ConnectWallet from "../connect-wallet/index";

const { SubMenu } = Menu;

const rightMenus = {
  Trade: "/trade",
  Pool: "/pool",
  DDS: {
    Mining: "/mining",
    Swap: "/swap-burn",
  },
  Broker: "/broker",
  Analytics: "/home",
  Support: {
    Whitepaper: "/Whitepaper",
    FAQ: "/faq",
    "Developer Docs": "/docs",
    API: "/api",
    Github: "/github",
    Twitter: "/Twitter",
    Reddit: "/Reddit",
    "DDerivatives DAO": "/dao",
    Vote: "/vote",
  },
  Audit: "/home",
  "Bug Bounty": "/home",
  Liquidator: "/home",
  Blog: "/home",
  "Brand Assets": "/home",
  "Terms of Service": "/terms",
};

const renderRightMenus = (config: any) => {
  return Object.keys(config).map((linkName) => {
    const url = config[linkName];
    const isUrl = typeof url === "string";
    return isUrl ? (
      <Menu.Item key={linkName}><Link to={url}>{linkName}</Link></Menu.Item>
    ) : (
      <SubMenu
        key={linkName}
        title={linkName}
      >
        {renderRightMenus(url)}
      </SubMenu>
    );
  });
};
export default class Header extends Component<{ darkMode?: boolean }, any> {
  componentDidMount() {}

  state = {
    current: "mail",
    drawerOpen: false,
  };

  openDrawer = () => {
    this.setState({
      drawerOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerOpen: false,
    });
  };

  handleClick = (e: any) => {
    console.log("click ", e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    const { darkMode } = this.props;
    const { drawerOpen } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) =>
          isMobile ? (
            <div className={styles.homeHeader}>
              <Row>
                <Col span={12}>DDerivatives</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Icon type="menu" onClick={this.openDrawer} />
                </Col>
                <Drawer
                  onClose={this.onClose}
                  placement="right"
                  visible={drawerOpen}
                  closable={true}
                >
                  <Menu
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    inlineCollapsed={false}
                  >
                    {renderRightMenus(rightMenus)}
                  </Menu>
                </Drawer>
              </Row>
            </div>
          ) : (
            <div
              className={[styles.root, darkMode ? "" : styles.light].join(" ")}
            >
              <Row type="flex" justify="space-between" align="middle">
                <Col span={20}>
                  <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                  >
                    <Menu.Item key="logo" className={styles.dderivatives}>
                      <Link to="/home" activeClassName="ant-menu-item-selected">
                        DDerivatives
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="trade">
                      <Link
                        to="/trade"
                        activeClassName="ant-menu-item-selected"
                      >
                        Trade
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="pool">
                      <Link to="/pool" activeClassName="ant-menu-item-selected">
                        Pool
                      </Link>
                    </Menu.Item>
                    <SubMenu
                      title={
                        <span className="submenu-title-wrapper">
                          DDS&nbsp;&nbsp;
                          <Icon type="down" />
                        </span>
                      }
                    >
                      <Menu.Item key="setting:1">
                        <Link
                          to="/mining"
                          activeClassName="ant-menu-item-selected"
                        >
                          Mining
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="setting:2">
                        <Link
                          to="/swap-burn"
                          activeClassName="ant-menu-item-selected"
                        >
                          Swap & Burn
                        </Link>
                      </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="broker">
                      <Link
                        to="/broker"
                        activeClassName="ant-menu-item-selected"
                      >
                        Broker
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="analytics">
                      <Link
                        to="/analytics"
                        activeClassName="ant-menu-item-selected"
                      >
                        Analytics
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="support">
                      Support&nbsp;&nbsp;
                      <Icon type="down" />
                    </Menu.Item>
                  </Menu>
                </Col>
                <Col span={4} className={styles.connectWpr}>
                  <ConnectWallet>
                    <Button className={styles.connectBtn}>
                      Connect Wallet
                    </Button>
                  </ConnectWallet>
                </Col>
              </Row>
            </div>
          )
        }
      </SiteContext.Consumer>
    );
  }
}
