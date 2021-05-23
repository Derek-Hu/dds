import { Component } from 'react';
import { Dropdown } from 'antd';
import SettingIcon from '~/assets/imgs/setting.svg';
import styles from './setting.style.module.less';
import InputNumber from '../../input/index';

type IState = {
  visible: boolean;
};

const settingOverlay = (
  <div style={{ width: '400px', transform: 'translate(20px, 0)' }}>
    <div className={[styles.box2, styles['flex-col']].join(' ')}>
      <div className={[styles.group1, styles['flex-row']].join(' ')}>
        <span className={styles.info4}>Trade&nbsp;Settings</span>
      </div>

      <div className={[styles.group2, styles['flex-row']].join(' ')}>
        <span className={styles.word6}>Slippage&nbsp;Tolerance</span>
      </div>

      <div className={[styles.group3, styles['flex-row']].join(' ')}>
        <div className={styles.wrap}>
          <span className={styles.info}>0.5%</span>
        </div>
        <div className={styles.wrap}>
          <span className={styles.info}>1%</span>
        </div>
        <div className={styles.wrap}>
          <span className={styles.info}>3%</span>
        </div>

        <InputNumber className={styles.wrap} onChange={() => ({})} />
        <span className={styles.txt5}>%</span>
      </div>

      <div className={[styles.group5, styles['flex-row']].join(' ')}>
        <span className="word9">Transaction&nbsp;Deadline</span>
      </div>

      <div className={[styles.group1, styles['flex-row']].join(' ')}>
        <div className={[styles.layer2, styles['flex-col']].join(' ')}>
          <span className={styles.word10}>20</span>
        </div>
        <span className={styles.txt6}>min</span>
      </div>
      {/*<div className="group7 flex-row">*/}
      {/*  <span className="word11">Expert&nbsp;Mode</span>*/}
      {/*  <div className="main1 flex-col"/>*/}
      {/*</div>*/}
    </div>
  </div>
);

export class Setting extends Component<{}, IState> {
  state: IState = { visible: false };

  private clickIcon() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <Dropdown overlay={settingOverlay} placement="bottomLeft" visible={this.state.visible} trigger={[]}>
        <img src={SettingIcon} onClick={() => this.clickIcon()} style={{ width: '1.4em', float: 'right' }} />
      </Dropdown>
    );
  }
}
