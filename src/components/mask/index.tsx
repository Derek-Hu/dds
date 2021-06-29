import styles from './style.module.less';
import { Icon, Button } from 'antd';
import success from '../../assets/images/success.png';
import pending from '../../assets/images/pending.png';
import fail from '../../assets/images/fail.png';
import ReactDOM from 'react-dom';

export default {
  dom: null,

  $run(
    url: string,
    pendingText: string | null = 'Pending',
    failText: string | null = 'Failed',
    title: string | null = null
  ) {
    if (failText === null) {
      failText = 'Failed';
    }
    if (pendingText === null) {
      pendingText = 'Pending';
    }

    // @ts-ignore
    this.hide();
    // @ts-ignore
    this.dom = document.createElement('div');

    const JSXdom = (
      <div className={styles.tooltip}>
        <div className={styles.wpr}>
          <div className={styles.content}>
            <span
              onClick={() => {
                this.hide();
                // @ts-ignore
                window.globalRefresh && window.globalRefresh();
              }}
              className={styles.close}
            >
              <Icon type="close" />
            </span>

            {title ? <div className={styles.title}>{title}</div> : null}

            <div className={styles.imgContent}>
              <img src={url} alt="" className={url === pending ? styles.loading : ''} />
            </div>

            <p>{url === fail ? failText : url === success ? 'Succeed' : pendingText}</p>

            {url === pending ? null : (
              <Button type="primary" onClick={() => this.hide()} className={styles.btn}>
                OK
              </Button>
            )}
          </div>
        </div>
      </div>
    );
    // @ts-ignore
    ReactDOM.render(JSXdom, this.dom);
    // @ts-ignore
    document.body.appendChild(this.dom);
  },

  showLoading(loadingText: string | null = null, title: string | null = null) {
    this.$run(pending, loadingText, null, title);
  },

  showSuccess(title: string | null = null) {
    this.$run(success, null, null, title);
  },

  showFail(failText: string | null = null, title: string | null = null) {
    this.$run(fail, null, failText, title);
  },
  hide() {
    // @ts-ignore
    this.dom && this.dom.remove();
  },
};
