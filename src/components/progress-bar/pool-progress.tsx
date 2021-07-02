import WithIndicator, { IIndicatorProgress } from './with-indicator';
import styles from './pool.module.less';
import SiteContext from '../../layouts/SiteContext';

export interface IMiningShare {
  title: string;
  desc?: any;
  coins: Array<IIndicatorProgress> | ICoinProgressObj;
  totalMode: boolean;
  children?: any;
  loading: boolean;
}

export default (props: IMiningShare) => {
  const { title, desc, coins, loading, totalMode, children } = props;

  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ''].join(' ')}>
          <h2>{title}</h2>
          <p>{desc}</p>
          {Array.isArray(coins)
            ? coins.map((coin, index) => (
                <WithIndicator key={index} loading={loading} totalMode={totalMode} data={coin} />
              ))
            : coins
            ? Object.keys(coins).map(label => (
                <WithIndicator key={label} loading={loading} totalMode={totalMode} data={{ label, ...coins[label] }} />
              ))
            : null}
          {children}
        </div>
      )}
    </SiteContext.Consumer>
  );
};
