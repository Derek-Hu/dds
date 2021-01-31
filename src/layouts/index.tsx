import { Component } from "react";
import HomeLayout from "../layouts/home.layout";
import TradeLayout from "../layouts/trade.layout";
import { RouteComponentProps } from "react-router-dom";
import SiteContext from "./SiteContext";

const RESPONSIVE_MOBILE = 768;

interface IState {
  isMobile: boolean;
}
export default class Layout extends Component<RouteComponentProps, IState> {
  static contextType = SiteContext;

  state: IState = { isMobile: false };

  componentDidMount() {
    this.updateMobileMode();
    window.addEventListener("resize", this.updateMobileMode);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateMobileMode);
  }

  updateMobileMode = () => {
    const { isMobile } = this.state;
    const newIsMobile = window.innerWidth < RESPONSIVE_MOBILE;
    if (isMobile !== newIsMobile) {
      this.setState({
        isMobile: newIsMobile,
      });
    }
  };
  render() {
    const { children, location } = this.props;
    const { isMobile } = this.state;
    const LayoutComp = location.pathname === "/home" ? HomeLayout : TradeLayout;

    return (
      <SiteContext.Provider value={{ isMobile, direction: "ltr" }}>
        <div className={isMobile ? "mobile" : ""}>
          <LayoutComp>{children}</LayoutComp>
        </div>
      </SiteContext.Provider>
    );
  }
}
