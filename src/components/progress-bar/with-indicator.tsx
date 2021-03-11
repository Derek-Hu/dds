import { Progress } from 'antd';
import FillGrid from '../fill-grid';
import styles from './with.module.less';
import numeral from 'numeral';

export interface IIndicatorProgress {
  label: string;
  percentage?: number;
  val?: any;
}
export default ({ data, totalMode }: { data: IIndicatorProgress; totalMode: boolean }) => {
  const { label, percentage, val } = data;

  const pecentText = numeral(percentage).format('0,0.0000');
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
              <span>{pecentText}%</span>
              <span style={style}>{val}</span>
            </p>
            <Progress strokeColor="#1346FF" percent={percentage} showInfo={false} />
          </div>
        }
      />
    </div>
  );
};
