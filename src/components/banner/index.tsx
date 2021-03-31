import { Button } from 'antd';
import styles from './style.module.less';
import { ddsBasePath } from '../../constant';
import SiteContext from '../../layouts/SiteContext';
import { Visible, Hidden } from '../builtin/hidden';

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.root}>
          <div className={styles.content}>
            <h2>
              The First Decentralized Risk-free <br />
              Perpetual Contract
            </h2>
            <Hidden when={isMobile}>
              <a href={`${ddsBasePath}/trade`}>
                <Button className={styles.spot}>Start Trading</Button>
              </a>
              <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                <Button className={styles.read} type="link">
                  READ WHITEPAPER
                </Button>
              </a>
            </Hidden>
            <Visible when={isMobile}>
              <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                <Button className={styles.spot}>READ WHITEPAPER</Button>
              </a>
            </Visible>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
