import { Button } from 'antd';
import styles from './style.module.less';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h2>
          The world's first <br />
          Decentralized Non-Risk Perpetual Exchange
        </h2>
        <Link to="/trade">
          <Button className={styles.spot}>Spot Trading</Button>
        </Link>
        <a href="http://www.baidu.com" rel="noreferrer" target="_blank">
          <Button className={styles.read} type="link">
            Read the docs
          </Button>
        </a>
      </div>
    </div>
  );
};
