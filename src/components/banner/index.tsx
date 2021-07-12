import { Button, Row, Col } from 'antd';
import styles from './style.module.less';
import { ddsBasePath } from '../../constant';
import SiteContext from '../../layouts/SiteContext';
import { Visible, Hidden } from '../builtin/hidden';
import { formatMessage } from 'locale/i18n';
import { format } from '../../util/math';
import TweenOne from 'rc-tween-one';

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.banner}>
          <div className={styles.contentWpr}>
            <div className={styles.content}>
              <TweenOne className="banner-user-title" animation={{ y: 70, opacity: 0, delay: 200, type: 'from' }}>
                <h2>{formatMessage({ id: 'shield-slogan' }, true)}</h2>
                <p>{formatMessage({ id: 'shield-slogan-desc' })}</p>
                <Hidden when={isMobile}>
                  <a href={`${ddsBasePath}/trade`}>
                    <Button type="primary" className={styles.spot}>
                      {formatMessage({ id: 'start-trade' })}
                    </Button>
                  </a>
                  <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                    <Button className={styles.read}>{formatMessage({ id: 'read-whitepaper' })}</Button>
                  </a>
                </Hidden>
                <Visible when={isMobile}>
                  <a href="https://docsend.com/view/tik7bk6c6vv6nqwv" rel="noreferrer" target="_blank">
                    <Button className={styles.spot}>{formatMessage({ id: 'read-whitepaper' })}</Button>
                  </a>
                </Visible>
              </TweenOne>
            </div>
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
