import { Component } from 'react';
import { Menu, Icon, Row, Col, Button, Drawer } from 'antd';
import styles from './style.module.less';
import { NavLink as Link, Link as LLink } from 'react-router-dom';
import SiteContext from '../../layouts/SiteContext';
import ConnectWallet from '../connect-wallet/index';
import Logo from '~/assets/imgs/logo.png';
import LogoWhite from '~/assets/imgs/logo-white.png';
import { homeBasePath, ddsBasePath } from '../../constant/index';
import { isNumberLike } from '../../util/math';
import { formatMessage } from 'util/i18n';

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
    // 'DDerivatives DAO': '/dao',
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
    return Object.keys(config).map(linkName => {
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
        {({ isMobile, account }) =>
          isMobile ? (
            darkMode ? (
              <div className={styles.homeHeader}>
                <a href={`${homeBasePath}/home`}>
                  <img src={window.location.hash === '#/home' ? LogoWhite : Logo} alt="" width="120px" />
                </a>
                {/* <Row>
                  <Col span={12}>Shield</Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Icon type="menu" onClick={this.openDrawer} />
                  </Col>
                  <Drawer onClose={this.onClose} placement="right" visible={drawerOpen} closable={true}>
                    <Menu defaultOpenKeys={['sub1']} mode="inline" inlineCollapsed={false}>
                      {this.renderRightMenus(rightMenus)}
                    </Menu>
                  </Drawer>
                </Row> */}
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
                        <a href={`${ddsBasePath}/trade`}>{formatMessage({ id: 'menu-trade' })}</a>
                      </Menu.Item>
                      <Menu.Item key="pool">
                        <a href={`${ddsBasePath}/pool`}>{formatMessage({ id: 'menu-pool' })}</a>
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
                          <a href={`${ddsBasePath}/mining`}>{formatMessage({ id: 'menu-mining' })}</a>
                        </Menu.Item>
                        <Menu.Item key="setting:2">
                          <a href={`${ddsBasePath}/swap-burn`}>{formatMessage({ id: 'menu-swap-burn' })}</a>
                        </Menu.Item>
                      </SubMenu>
                      <Menu.Item key="broker">
                        <a href={`${ddsBasePath}/broker`}>{formatMessage({ id: 'menu-broker' })}</a>
                      </Menu.Item>
                    </Menu>
                  </Col>
                </Row>
              </div>
            )
          ) : (
            <div className={[styles.root, darkMode ? '' : styles.light].join(' ')}>
              <Row type="flex" justify="space-between" align="middle">
                <Col span={12}>
                  <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                    <Menu.Item key="logo" className={styles.dderivatives}>
                      <a href={`${homeBasePath}/home`}>
                        <img src={window.location.hash === '#/home' ? LogoWhite : Logo} alt="" width="120px" />
                      </a>
                    </Menu.Item>
                    <Menu.Item key="trade">
                      <a href={`${ddsBasePath}/trade`}>{formatMessage({ id: 'menu-trade' })}</a>
                    </Menu.Item>
                    <Menu.Item key="pool">
                      <a href={`${ddsBasePath}/pool`}>{formatMessage({ id: 'menu-pool' })}</a>
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
                          <div className="title">{formatMessage({ id: 'token-economics' })}</div>
                          <div className="content">{formatMessage({ id: 'token-economics-description' })}</div>
                          {/* <Link to="/" className="link" style={{ color: '#1346FF' }}>
                            Learn more
                          </Link> */}
                        </div>
                        <div className="bottom">
                          <a href={`${ddsBasePath}/mining`} className="link">
                            {formatMessage({ id: 'menu-mining' })}
                          </a>
                          <a href={`${ddsBasePath}/swap-burn`} className="link">
                            {formatMessage({ id: 'menu-swap-burn' })}
                          </a>
                        </div>
                      </div>
                    </SubMenu>
                    <Menu.Item key="broker">
                      <a href={`${ddsBasePath}/broker`}>{formatMessage({ id: 'menu-broker' })}</a>
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
                <Col span={12} className={styles.connectWpr}>
                  {window.location.hash === '#/home' ? (
                    <Button className={styles.connectBtn}>
                      <a href={`${ddsBasePath}/trade`}>{formatMessage({ id: 'trade' })}</a>
                    </Button>
                  ) : (
                    <div className={styles.rightContent}>
                      <div className={styles.network}>
                        <span className={styles.icon}></span>
                        {formatMessage({ id: 'network-kovan' })}
                      </div>
                      <ConnectWallet>
                        {account ? (
                          <div className={styles.accountInfo}>
                            {account.USDBalance
                              ? Object.keys(account.USDBalance)
                                  .filter(coin => coin !== 'USDT' && coin !== 'USDC')
                                  .map(coin => (
                                    <span key={coin}>
                                      {isNumberLike(account.USDBalance[coin]) ? account.USDBalance[coin].toFixed(1) : 0}
                                      &nbsp;
                                      {coin}
                                    </span>
                                  ))
                              : null}
                            <span>{account.address.replace(/^(.{6})(.*)(.{4})/, '$1...$3')}</span>
                          </div>
                        ) : (
                          <Button className={styles.connectBtn}>{formatMessage({ id: 'connect-wallet' })}</Button>
                        )}
                      </ConnectWallet>
                    </div>
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
