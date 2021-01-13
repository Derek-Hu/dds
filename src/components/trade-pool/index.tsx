import ProgressBar, { IBarData } from "../progress-bar/index";
import styles from "./style.module.less";

const publicBar: IBarData = {
    left: {
        title: 'LP1 Utilization Rate',
        percentage: 80,
    },
    right: {
        title: 'Available Liquidity',
        value: <span>37863/ 65349</span>
    },
    unit: 'DAI'
}

const privateBar: IBarData = {
    left: {
        title: 'LP2 Utilization Rate',
        percentage: 85,
    },
    right: {
        title: 'Available Liquidity',
        value: <span>37863/ 65349</span>
    },
    unit: 'DAI'

}
export default () => {
  return (
    <div className={styles.root}>
      <h2>Liquidity Pool</h2>
      <div className={styles.barContainer}>
        <ProgressBar data={publicBar}/>
        <div style={{padding: '20px'}}></div>
        <ProgressBar data={privateBar}/>
      </div>
    </div>
  );
};
