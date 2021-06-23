import { Button } from 'antd';
import styles from './style.module.less';
import { ddsBasePath } from '../../constant';
import SiteContext from '../../layouts/SiteContext';
import { Visible, Hidden } from '../builtin/hidden';
import { formatMessage } from 'locale/i18n';

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.root}>
          <div className={styles.content}>
            <h2>{formatMessage({ id: 'shield-slogan' }, true)}</h2>
            <Hidden when={isMobile}>
              <a href={`${ddsBasePath}/trade`}>
                <Button className={styles.spot}>{formatMessage({ id: 'start-trade' })}</Button>
              </a>
              <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                <Button className={styles.read} type="link">
                  {formatMessage({ id: 'read-whitepaper' })}
                </Button>
              </a>
            </Hidden>
            <Visible when={isMobile}>
              <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                <Button className={styles.spot}>{formatMessage({ id: 'read-whitepaper' })}</Button>
              </a>
            </Visible>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
