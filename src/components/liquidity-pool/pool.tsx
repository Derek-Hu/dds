import { Row, Col } from 'antd';
import styles from './pool.module.less';
import numeral from 'numeral';
import SiteContext from '../../layouts/SiteContext';

export interface IPool {
  title: string;
  usd?: number;
  coins: Array<{ label: string; value: number }>;
  children?: React.ReactElement | React.ReactElement[];
  smallSize?: boolean;
}
export default (props: IPool) => {
  const { title, usd, coins, children, smallSize } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, smallSize ? styles.small : '', isMobile ? styles.mobile : ''].join(' ')}>
          <h4>{title}</h4>
          {usd === null || usd === undefined ? null : (
            <p className={styles.numbers}>
              {numeral(usd).format('0,0')} <span>USD</span>
            </p>
          )}
          <Row>
            {coins ? coins.map(({ label, value }) => (
              <Col key={label} span={8}>
                <p className={styles.coinName}>{label}</p>
                <span>{value}</span>
              </Col>
            )): null}
          </Row>
          {children}
        </div>
      )}
    </SiteContext.Consumer>
  );
};
