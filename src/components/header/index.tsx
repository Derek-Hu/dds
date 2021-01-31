import { Component } from "react";
import { Menu, Icon, Row, Col, Button, Drawer } from "antd";
import styles from "./style.module.less";
import { NavLink as Link } from "react-router-dom";
import SiteContext from "../../layouts/SiteContext";
import ConnectWallet from "../connect-wallet/index";

const { SubMenu } = Menu;

const mobileHeader = () => {
  return (
    <Row>
      <Col span={12}>DDerivatives</Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <Icon type="menu" />
      </Col>
      <Drawer title="Basic Drawer" placement="right" closable={true}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </Row>
  );
};

export default class Header extends Component<{ darkMode?: boolean }, any> {
  componentDidMount() {}

  state = {
    current: "mail",
  };

  handleClick = (e: any) => {
    console.log("click ", e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    const { darkMode } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) =>
          isMobile ? (
            mobileHeader()
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
