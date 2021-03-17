import { Button } from 'antd';
import styles from './style.module.less';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h2>
          The First Decentralized Risk-free <br />
          Perpetual Contract
        </h2>
        <Link to="/trade">
          <Button className={styles.spot}>Start Trading</Button>
        </Link>
        <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
          <Button className={styles.read} type="link">
            Read the docs
          </Button>
        </a>
      </div>
    </div>
  );
};
