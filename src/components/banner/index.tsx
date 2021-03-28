import { Button } from 'antd';
import styles from './style.module.less';
import { ddsBasePath } from '../../constant';

export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h2>
          The First Decentralized Risk-free <br />
          Perpetual Contract
        </h2>
        <a href={`${ddsBasePath}/trade`}>
          <Button className={styles.spot}>Start Trading</Button>
        </a>
        <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
          <Button className={styles.read} type="link">
            READ WHITEPAPER
          </Button>
        </a>
      </div>
    </div>
  );
};
