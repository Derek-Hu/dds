import { Component } from "react";
import HomeLayout from "../layouts/home.layout";
import TradeLayout from "../layouts/trade.layout";
import { RouteComponentProps } from "react-router-dom";

export default class Layout extends Component<RouteComponentProps, any> {
  render() {
    const { children, location } = this.props;

    if (location.pathname === "/home") {
      return <HomeLayout>{children}</HomeLayout>
    }

    return <TradeLayout>{children}</TradeLayout>;
  }
}
