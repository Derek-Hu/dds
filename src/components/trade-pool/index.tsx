import { Component } from 'react';
import ProgressBar, { IBarData } from "../progress-bar/index";
import styles from "./style.module.less";
import SiteContext from "../../layouts/SiteContext";

const publicBar: IBarData = {
  left: {
    title: 'Public Pool',
    percentage: 80,
  },
  right: {
    title: 'Available Liquidity',
    value: <span>37863/ 65349</span>,
  },
  unit: 'DAI',
};

const privateBar: IBarData = {
  left: {
    title: 'Private Pool',
    percentage: 85,
  },
  right: {
    title: 'Available Liquidity',
    value: <span>37863/ 65349</span>,
  },
  unit: 'DAI',
};
export default class TradePool extends Component {
  render(){

    return (
      <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
          <h2>Liquidity Pool</h2>
          <div className={styles.barContainer}>
            <ProgressBar data={publicBar} />
            <div style={{ padding: '40px' }}></div>
            <ProgressBar data={privateBar} />
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
}
};
