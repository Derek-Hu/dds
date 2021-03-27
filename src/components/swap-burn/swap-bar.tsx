import styles from './swap-bar.module.less';
import SiteContext from '../../layouts/SiteContext';
import Placeholder from '../placeholder/index';

const datas = {
  left: { percentage: 100 },
  right: { percentage: 10 },
};

const shadowRect = {
  width: 280,
  height: 215,
};
const mobileRect = {
  width: window.innerWidth - 70 - 200,
  height: 215,
};

export default ({
  leftAmount,
  loading,
  rightAmount,
}: {
  leftAmount?: string;
  loading: boolean;
  rightAmount?: string;
}) => {
  const { left, right } = datas;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => {
        const rect = isMobile ? mobileRect : shadowRect;
        const { width, height } = rect;
        const leftTop = ((100 - left.percentage) * height) / 100;
        const rightBottom = ((100 - right.percentage) * height) / 100;

        return (
          <div className={styles.root}>
            <div className={styles.leftBar}>
              <div className={styles.bar} style={{ height: height + 'px' }}>
                <div className={styles.percentBar} style={{ height: 100 - left.percentage + '%' }}></div>
                <p>Shield Net Income</p>
                <span>{left.percentage}%</span>
              </div>
              <div className={styles.amount}>
                <Placeholder loading={loading}>{leftAmount}<br/>USD</Placeholder>
              </div>
            </div>
            <div className={styles.shadow} style={{ width: width + 'px', height: height + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height={height} width={width}>
                <polygon points={`0,0 0,${leftTop} ${width},${rightBottom} ${width},0`} stroke-width="0" fill="#fff" />
              </svg>
            </div>
            <div className={styles.rightBar}>
              <div className={styles.bar} style={{ height: height + 'px' }}>
                <div className={styles.percentBar} style={{ height: right.percentage + '%' }}></div>
                <p>SLD Circulating Supply ×{right.percentage}%</p>
                <span className={styles.rightPecentage}>{right.percentage}%</span>
              </div>
              <div className={styles.amount}>
                <Placeholder loading={loading}>{rightAmount}<br/>SLD</Placeholder>
              </div>
            </div>
          </div>
        );
      }}
    </SiteContext.Consumer>
  );
};
