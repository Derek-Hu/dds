import styles from './style.module.less';
import { Icon, Button } from 'antd';
import success from '../../assets/images/success.png';
import pending from '../../assets/images/pending.png';
import fail from '../../assets/images/fail.png';
import ReactDOM from 'react-dom';

export default {
  dom: null,

  $run(url: string, pendingText = 'Pending', failText = 'Failed') {
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
  showLoading(loadingText: string | null = null) {
    if (loadingText) {
      this.$run(pending, loadingText);
    } else {
      this.$run(pending);
    }
  },
  showSuccess() {
    this.$run(success);
  },
  showFail(failText: string | null = null) {
    if (failText) {
      this.$run(fail, '', failText);
    } else {
      this.$run(fail);
    }
  },
  hide() {
    // @ts-ignore
    this.dom && this.dom.remove();
  },
};
