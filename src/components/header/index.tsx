import { Component } from "react";
import { Menu, Icon, Row, Col } from "antd";
import styles from "./style.module.less";

const { SubMenu } = Menu;

export default class Header extends Component {
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
    return (
      <div className={styles.root}>
        <Row  type="flex" justify="space-between" align="middle">
          <Col span={20}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="logo" className={styles.dderivatives}>
                DDerivatives
              </Menu.Item>
              <Menu.Item key="trade">Trade</Menu.Item>
              <Menu.Item key="pool">Pool</Menu.Item>
              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
                    DDS&nbsp;&nbsp;
                    <Icon type="down" />
                  </span>
                }
              >
                <Menu.ItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <Menu.Item key="broker">Broker</Menu.Item>
              <Menu.Item key="analytics">Analytics</Menu.Item>
              <Menu.Item key="support">
                Support&nbsp;&nbsp;
                <Icon type="down" />
              </Menu.Item>
              {/* <Menu.Item key="alipay">
            <a
              href="https://ant.design"
              target="_blank"
              rel="noopener noreferrer"
            >
              Navigation Four - Link
            </a>
          </Menu.Item> */}
            </Menu>
          </Col>
          <Col span={4} className={styles.connectWpr}>
            <div className={styles.connectBtn}><span>Connect Wallet</span></div>
          </Col>
        </Row>
      </div>
    );
  }
}
