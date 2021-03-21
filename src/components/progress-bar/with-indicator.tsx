import { Progress } from 'antd';
import FillGrid from '../fill-grid';
import styles from './with.module.less';
import Placeholder from '../placeholder/index';
import { isNumberLike, isNotZeroLike, format } from '../../util/math';

export interface IIndicatorProgress {
  label: string;
  percentage?: number;
  val?: any;
}
export default ({ data, totalMode, loading }: { data: IIndicatorProgress; loading: boolean; totalMode: boolean }) => {
  const { label, percentage, val } = data;

  const pecentText = format(percentage);
  const style = totalMode
    ? {
        color: '#333333',
        left: 'auto',
        right: 0,
        transform: 'translate(0, 0)',
      }
    : { left: pecentText + '%' };
  return (
    <div className={styles.root}>
      <FillGrid
        className={styles.bar}
        left={<span className={styles.label}>{label}</span>}
        right={
          <div>
            <p className={styles.indicator}>
              <span>
                <Placeholder loading={loading}>{pecentText}%</Placeholder>
              </span>
              <span style={style}>
                <Placeholder loading={loading}>{val}</Placeholder>
              </span>
            </p>
            <Progress strokeColor="#1346FF" percent={percentage} showInfo={false} />
          </div>
        }
      />
    </div>
  );
};
