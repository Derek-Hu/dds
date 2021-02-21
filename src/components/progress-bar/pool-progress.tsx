import WithIndicator, {
  IIndicatorProgress,
} from "./with-indicator";
import styles from './pool.module.less';
import SiteContext from "../../layouts/SiteContext";

export interface IMiningShare {
  title: string;
  desc?: any;
  coins: Array<IIndicatorProgress>;
  totalMode: boolean;
}

export default (props: IMiningShare) => {
  const { title, desc, coins, totalMode } = props;

  return     <SiteContext.Consumer>
  {({ isMobile }) => (
    <div className={[styles.root, isMobile? styles.mobile: ''].join(' ')}>
      <h2>{title}</h2>
      <p>{desc}</p>
      {coins.map((coin) => (
        <WithIndicator totalMode={totalMode} data={coin} />
      ))}
    </div>
  )}
  </SiteContext.Consumer>
};