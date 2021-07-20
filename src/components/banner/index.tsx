import { Button, Row, Col } from 'antd';
import styles from './style.module.less';
import { ddsBasePath } from '../../constant';
import SiteContext from '../../layouts/SiteContext';
import { Visible, Hidden } from '../builtin/hidden';
import { formatMessage } from 'locale/i18n';
import bg from '../../assets/imgs/adsImage.png';
import TweenOne from 'rc-tween-one';
import { IAnimObject } from 'rc-tween-one/typings/AnimObject';
import PathPlugin from 'rc-tween-one/lib/plugin/PathPlugin';

TweenOne.plugins.push(PathPlugin);

const path = `M3.5,175V19c0,0,1-8.75,8.25-11.5S26.5,8,26.5,8l54,53.25
c0,0,7,8.25,14.5,0.75s51.5-52.25,51.5-52.25s9.75-7,18-2s7.75,11.5,7.75,11.5
v104c0,0-0.5,15.75-15.25,15.75s-15.75-15-15.75-15V68.5c0,0-0.125-9.125-6-3.25
s-36.25,36-36.25,36s-11.625,11.875-24-0.5S40.25,65.5,40.25,65.5
s-5.75-5.25-5.75,2s0,107.25,0,107.25s-0.75,13.5-14.5,13.5S3.5,175,3.5,175z`;

const animation: IAnimObject = {
  path: path,
  repeat: -1,
  duration: 5000,
  ease: 'linear',
};

export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={styles.banner}>
          <img className={styles.bannerBg} src={bg} />
          <div className={styles.contentWpr}>
            <div className={styles.content}>
              {/* <TweenOne
                animation={animation}
                style={{ margin: 0, background: '#000', width: 20, height: 20, transform: 'translate(-10px, -10px)' }}
                className="code-box-shape"
                paused={false}
              />
              <svg width="200" height="200">
                <path d={path} fill="none" stroke="rgba(1, 155, 240, 0.2)" />
              </svg> */}
              <TweenOne className={styles.bannerTitle} animation={{ y: 70, opacity: 0, delay: 200, type: 'from' }}>
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
