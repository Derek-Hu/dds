import { Component } from "react";
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import SiteContext from "../layouts/SiteContext";
export default class MainLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <Header />
            {children}
            {isMobile ? null : <Footer />}
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
