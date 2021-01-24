import { Component } from "react";
import { Menu, Icon, Row, Col, Button } from "antd";
import styles from "./style.module.less";
import {Link } from 'react-router-dom';

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
              <Link to="/home">DDerivatives</Link>
              </Menu.Item>
              <Menu.Item key="trade"><Link to="/trade">Trade</Link></Menu.Item>
              <Menu.Item key="pool"><Link to="/pool">Pool</Link></Menu.Item>
              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
                    DDS&nbsp;&nbsp;
                    <Icon type="down" />
                  </span>
                }
              >
                  <Menu.Item key="setting:1"><Link to="/mining">Mining</Link></Menu.Item>
                  <Menu.Item key="setting:2"><Link to="/swap-burn">Swap & Burn</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="broker"><Link to="/broker">Broker</Link></Menu.Item>
              <Menu.Item key="analytics"><Link to="/analytics">Analytics</Link></Menu.Item>
              <Menu.Item key="support">
                Support&nbsp;&nbsp;
                <Icon type="down" />
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={4} className={styles.connectWpr}>
            <Button className={styles.connectBtn}>Connect Wallet</Button>
            {/* <div className={styles.connectBtn}><span>Connect Wallet</span></div> */}
          </Col>
        </Row>
      </div>
    );
  }
}
