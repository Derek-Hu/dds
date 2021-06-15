import { Component } from 'react';
import { Button, Col, Icon, Menu, Row } from 'antd';
import styles from './style.module.less';
import { Link as LLink, Route } from 'react-router-dom';
import SiteContext, { ISiteContextProps } from '../../layouts/SiteContext';
import ConnectWallet from '../connect-wallet/index';
import Logo from '~/assets/imgs/logo.png';
import LogoMobile from '~/assets/imgs/logo-mobile.png';
import LogoWhite from '~/assets/imgs/logo-white.png';
import { ddsBasePath, DefaultKeNetwork, homeBasePath } from '../../constant/index';
import { isNumberLike } from '../../util/math';
import { shortAddress } from '../../util/index';
import NetworkSwitch from '../network-switch/index';
import { RouteKey } from '../../constant/routes';

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
    selectedNetwork: (this.context as ISiteContextProps).currentNetwork || DefaultKeNetwork,
  };

  componentWillReceiveProps(nextProps: any) {
    const key: RouteKey | null = this.findMenuKey((nextProps.location.pathname as string).substring(1));
    if (key) {
      this.setState({ current: key });
    }
  }

  findMenuKey(path: string): RouteKey | null {
    if (path.startsWith(RouteKey.pool)) {
      return RouteKey.pool;
    } else if (path.startsWith(RouteKey.trade)) {
      return RouteKey.trade;
    } else if (path.startsWith(RouteKey.mining)) {
      return RouteKey.mining;
    } else if (path.startsWith(RouteKey.swapBurn)) {
      return RouteKey.swapBurn;
    } else if (path.startsWith(RouteKey.broker)) {
      return RouteKey.broker;
    } else {
      return null;
    }
  }

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
    // const { currentNetwork } = this.context;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account, currentNetwork }) =>
          isMobile ? (
            darkMode ? (
              <div className={styles.homeHeader}>
                <a href={`${homeBasePath}/${RouteKey.home}`}>
                  <img src={window.location.hash === `#/${RouteKey.home}` ? LogoWhite : Logo} alt="" width="120px" />
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
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <img alt="" src={LogoMobile} width="30px" />
                  </Col>
                  <Col span={20} style={{ textAlign: 'right' }}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                      <Menu.Item key={RouteKey.trade}>
                        <a href={`${ddsBasePath}/${RouteKey.trade}`}>Trade</a>
                      </Menu.Item>
                      <Menu.Item key={RouteKey.pool}>
                        <a href={`${ddsBasePath}/${RouteKey.pool}`}>Pool</a>
                      </Menu.Item>
                      <SubMenu
                        title={
                          <span className="submenu-title-wrapper">
                            SLD&nbsp;&nbsp;
                            <Icon type="down" />
                          </span>
                        }
                      >
                        <Menu.Item key={RouteKey.mining}>
                          <a href={`${ddsBasePath}/${RouteKey.mining}`}>Mining</a>
                        </Menu.Item>
                        <Menu.Item key={RouteKey.swapBurn}>
                          <a href={`${ddsBasePath}/${RouteKey.swapBurn}`}>Swap & Burn</a>
                        </Menu.Item>
                      </SubMenu>
                      <Menu.Item key={RouteKey.broker}>
                        <a href={`${ddsBasePath}/${RouteKey.broker}`}>Broker</a>
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
                      <a href={`${homeBasePath}/${RouteKey.home}`}>
                        <img
                          src={window.location.hash === `#/${RouteKey.home}` ? LogoWhite : Logo}
                          alt=""
                          width="120px"
                        />
                      </a>
                    </Menu.Item>
                    <Menu.Item key={RouteKey.trade}>
                      <a href={`${ddsBasePath}/${RouteKey.trade}`}>Trade</a>
                    </Menu.Item>
                    <Menu.Item key={RouteKey.pool}>
                      <a href={`${ddsBasePath}/${RouteKey.pool}`}>Pool</a>
                    </Menu.Item>
                    <SubMenu
                      key="sld"
                      title={
                        <span className="submenu-title-wrapper">
                          SLD&nbsp;&nbsp;
                          <Icon type="down" />
                        </span>
                      }
                    >
                      {/*hidden*/}
                      <Menu.Item key="mining" style={{ display: 'none' }} />
                      <Menu.Item key="swap-burn" style={{ display: 'none' }} />
                      {/*------*/}

                      <div className="submenu-dialog">
                        <div className="top">
                          <div className="title">Token Economics</div>
                          <div className="content">
                            SLD is a utility token for community governance and fuels further Shield ecosystem
                            development.
                          </div>
                        </div>
                        <div className="bottom">
                          <a
                            href={`${ddsBasePath}/${RouteKey.mining}`}
                            className="link"
                            onClick={() => this.setState({ current: RouteKey.mining })}
                          >
                            Mining
                          </a>
                          <a
                            href={`${ddsBasePath}/${RouteKey.swapBurn}`}
                            className="link"
                            onClick={() => this.setState({ current: RouteKey.swapBurn })}
                          >
                            Swap & Burn
                          </a>
                        </div>
                      </div>
                    </SubMenu>
                    <Menu.Item key={RouteKey.broker}>
                      <a href={`${ddsBasePath}/${RouteKey.broker}`}>Broker</a>
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
                  {window.location.hash === `#/${RouteKey.home}` ? (
                    <Button className={styles.connectBtn}>
                      <a href={`${ddsBasePath}/${RouteKey.trade}`}>Trade</a>
                    </Button>
                  ) : (
                    <div className={styles.rightContent}>
                      <div className={styles.network}>
                        {currentNetwork === 'kovan' ? (
                          <a href="https://faucet.kovan.network/" rel="noreferrer" target="_blank">
                            Kovan-Faucet
                          </a>
                        ) : (
                          <a href="https://testnet.binance.org/faucet-smart" rel="noreferrer" target="_blank">
                            BSC-faucet
                          </a>
                        )}
                      </div>

                      {account && account.address ? <NetworkSwitch></NetworkSwitch> : null}

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
                            <span>{shortAddress(account.address)}</span>
                          </div>
                        ) : (
                          <Button className={styles.connectBtn}>Connect Wallet</Button>
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
