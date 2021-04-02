import { Component } from 'react';
import { Icon, Modal, Button, Checkbox } from 'antd';
import LiquidityPool from '../components/liquidity-pool/index';
import styles from './style.module.less';
import SiteContext from '../layouts/SiteContext';

const cacheKey = 'dontShowAgain';
const cacheVal = 'Y';

export default class PoolPage extends Component {
  componentDidMount() {
    console.log('mount');
  }

  state = {
    visible: localStorage.getItem(cacheKey) !== cacheVal,
    agreed: false,
  };

  closeAgree = () => {
    this.setState({
      visible: false,
    });

    if (this.state.agreed) {
      localStorage.setItem(cacheKey, cacheVal);
    }
  };

  onCheckChange = (e: any) => {
    this.setState({
      agreed: e.target.checked,
    });
  };
  render() {
    const { agreed, visible } = this.state;
    return (
      <SiteContext.Consumer>
        {({ address }) => {
          return (
            <div>
              <LiquidityPool />
              <Modal
                width={450}
                // @ts-ignore
                visible={visible && address}
                title={
                  <span style={{ color: '#F55858' }}>
                    <Icon type="warning" />
                    &nbsp;RISK WARNING
                  </span>
                }
                closable={false}
                className={styles.modal}
                onCancel={this.closeAgree}
                footer={[
                  <Button type="danger" onClick={this.closeAgree}>
                    I understand and agree
                  </Button>,
                  <Checkbox checked={agreed} onChange={this.onCheckChange} className={styles.agree}>
                    Don't show it again
                  </Checkbox>,
                ]}
              >
                <p>
                  Shield protocol is under audit. Your funds still might be at risk and you can lose up to 100% of the
                  amount provided. This is BETA version and use at your own risk.
                </p>
              </Modal>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
