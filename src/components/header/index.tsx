import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import styles from './style.module.less';
import { NavLink as Link, Link as LLink, Redirect } from 'react-router-dom';
import SiteContext from '../../layouts/SiteContext';
import ConnectWallet from '../connect-wallet/index';
import Logo from '~/assets/imgs/logo.png';
import LogoWhite from '~/assets/imgs/logo-white.png';

const { SubMenu } = Menu;

const rightMenus = {
  Trade: '/trade',
  Pool: '/pool',
  SLD: {
    Mining: '/mining',
    Swap: '/swap-burn',
  },
  Broker: '/broker',
  Analytics: '/home',
  Support: {
    Whitepaper: '/Whitepaper',
    FAQ: '/faq',
    'Developer Docs': '/docs',
    API: '/api',
    Github: '/github',
    Twitter: '/Twitter',
    Reddit: '/Reddit',
    'DDerivatives DAO': '/dao',
    Vote: '/vote',
  },
  Audits: '/home',
  'Bug Bounty': '/home',
  Liquidator: '/home',
  Blog: '/home',
  'Brand Assets': '/home',
  'Terms of Service': '/terms',
};

export default class Header extends Component<{ darkMode?: boolean }, any> {
  componentDidMount() {}

  state = {
    current: 'mail',
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
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  gotoLink = (url: string) => {
    this.setState({
      drawerOpen: false,
    });
  };
  renderRightMenus = (config: any) => {
    return Object.keys(config).map((linkName) => {
      const url = config[linkName];
      const isUrl = typeof url === 'string';
      return isUrl ? (
        <Menu.Item key={linkName} onClick={() => this.gotoLink(url)}>
          <LLink to={url}>{linkName}</LLink>
        </Menu.Item>
      ) : (
        <SubMenu key={linkName} title={linkName}>
          {this.renderRightMenus(url)}
        </SubMenu>
      );
    });
  };

  render() {
    const { darkMode } = this.props;
    const { drawerOpen } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) =>
          isMobile ? (
            darkMode ? (
              <div className={styles.homeHeader}>
                <Row>
                  <Col span={12}>Shield</Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Icon type="menu" onClick={this.openDrawer} />
                  </Col>
                  <Drawer onClose={this.onClose} placement="right" visible={drawerOpen} closable={true}>
                    <Menu defaultOpenKeys={['sub1']} mode="inline" inlineCollapsed={false}>
                      {this.renderRightMenus(rightMenus)}
                    </Menu>
                  </Drawer>
                </Row>
              </div>
            ) : (
              <div className={[styles.root, darkMode ? '' : styles.light, styles.mobileLight].join(' ')}>
                <Row type="flex" justify="space-between" align="middle">
                  <Col span={2} style={{ textAlign: 'center' }}>
                    D
                  </Col>
                  <Col span={22} style={{ textAlign: 'right' }}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                      <Menu.Item key="trade">
                        <Link to="/trade" activeClassName="ant-menu-item-selected">
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
                            SLD&nbsp;&nbsp;
                            <Icon type="down" />
                          </span>
                        }
                      >
                        <Menu.Item key="setting:1">
                          <Link to="/mining" activeClassName="ant-menu-item-selected">
                            Mining
                          </Link>
                        </Menu.Item>
                        <Menu.Item key="setting:2">
                          <Link to="/swap-burn" activeClassName="ant-menu-item-selected">
                            Swap & Burn
                          </Link>
                        </Menu.Item>
                      </SubMenu>
                      <Menu.Item key="broker">
                        <Link to="/broker" activeClassName="ant-menu-item-selected">
                          Broker
                        </Link>
                      </Menu.Item>
                    </Menu>
                  </Col>
                </Row>
              </div>
            )
          ) : (
            <div className={[styles.root, darkMode ? '' : styles.light].join(' ')}>
              <Row type="flex" justify="space-between" align="middle">
                <Col span={16}>
                  <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                    <Menu.Item key="logo" className={styles.dderivatives}>
                      <Link to="/home" activeClassName="ant-menu-item-selected">
                        <img src={window.location.hash === '#/home' ? LogoWhite : Logo} alt="" width="120px" />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="trade">
                      <Link to="/trade" activeClassName="ant-menu-item-selected">
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
                          SLD&nbsp;&nbsp;
                          <Icon type="down" />
                        </span>
                      }
                    >
                      <div className="submenu-dialog">
                        <div className="top">
                          <p className="title">Token Economics</p>
                          <p>
                            SLD is a utility token for community governance and fuels further Sield ecosystem
                            development.
                          </p>
                          {/* <Link to="/" className="link" style={{ color: '#1346FF' }}>
                            Learn more
                          </Link> */}
                        </div>
                        <div className="bottom">
                          <Link to="/mining" className="link">
                            Mining
                          </Link>
                          <Link to="/swap-burn" className="link">
                            Swap & Burn
                          </Link>
                        </div>
                      </div>
                    </SubMenu>
                    <Menu.Item key="broker">
                      <Link to="/broker" activeClassName="ant-menu-item-selected">
                        Broker
                      </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="analytics">
                      <Link to="/analytics" activeClassName="ant-menu-item-selected">
                        Analytics
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="support">
                      Support&nbsp;&nbsp;
                      <Icon type="down" />
                    </Menu.Item> */}
                  </Menu>
                </Col>
                <Col className={styles.connectWpr}>
                  {window.location.hash === '#/home' ? (
                    <Button className={styles.connectBtn}>
                      <Link to="/trade">Trade</Link>
                    </Button>
                  ) : (
                    <ConnectWallet>
                      <Button className={styles.connectBtn}>Connect Wallet</Button>
                      {/* <div className={styles.accountInfo}>
                        <span>98 SLD</span>
                        <span>2.009DAI</span>
                        <span>0x8317...c496</span>
                      </div> */}
                    </ConnectWallet>
                  )}
                </Col>
              </Row>
            </div>
          )
        }
      </SiteContext.Consumer>
    );
  }
}
