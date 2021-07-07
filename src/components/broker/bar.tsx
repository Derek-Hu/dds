import styles from './bar.module.less';
import { formatMessage } from 'locale/i18n';

interface IProps {
  vertical?: boolean;
  right?: boolean;
  width: number;
  height?: number;
  className?: string;
  style?: object;
  percentage: number;
}

export default ({ vertical, right, style, className, percentage, width, height = 80 }: IProps) => {
  const fixed = percentage < 20;
  const remainFixed = percentage > 80;
  return (
    <div
      style={{ height: height + 'px', width: width + 'px', ...style }}
      className={[vertical ? styles.vertical : '', styles.root, className].join(' ')}
    >
      {vertical || right ? (
        <div
          style={vertical ? { height: 100 - percentage + '%' } : { width: 100 - percentage + '%' }}
          className={styles.spanWpr}
        >
          <span className={[styles.remains, remainFixed ? styles.fixed : '', right ? styles.right : ''].join(' ')}>
            {100 - percentage}%
          </span>
        </div>
      ) : null}
      <div
        className={[styles.percentage, fixed ? styles.fixed : '', right ? styles.right : ''].join(' ')}
        style={vertical ? { width: '100', height: percentage + '%' } : { width: percentage + '%', height: '100%' }}
      >
        <div className={styles.spanWpr}>
          {vertical ? (
            <span>{percentage}%</span>
          ) : (
            <span>
              {formatMessage({ id: 'basic' })}
              <br />
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
