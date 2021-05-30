import { Component } from 'react';
import { Dropdown } from 'antd';
import SettingIcon from '~/assets/imgs/setting.svg';
import styles from './setting.style.module.less';
import InputNumber from '../../input/index';
import SiteContext, { ISiteContextProps } from '../../../layouts/SiteContext';

type IState = {
  visible: boolean;
  tolerance: number;
  deadline: number;
};

type IProperty = {};

export class Setting extends Component<IProperty, IState> {
  static contextType = SiteContext;
  public readonly defaultTolerance = 1; // 默认1%
  public readonly defaultDeadline = 20; // default to 20 minutes

  state: IState = {
    visible: false,
    tolerance: this.defaultTolerance,
    deadline: this.defaultDeadline,
  };

  componentWillUpdate() {
    this.readSetting();
  }

  private readSetting() {
    const key: string = this.storageKey();
    const settingStr: string | null = localStorage.getItem(key);

    if (!settingStr) {
      return;
    }

    let setting: { tolerance: number; deadline: number } | null = null;

    try {
      setting = JSON.parse(settingStr);
    } catch (err) {}

    if (setting) {
      const eq: boolean = this.state.deadline === setting.deadline && this.state.tolerance === setting.tolerance;
      if (!eq) {
        this.updateSetting(setting);
      }
    }
  }

  private clickIcon() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  private clickTolerance(num: number) {
    if (!num) {
      num = this.defaultTolerance;
    }

    this.saveSetting({ tolerance: num, deadline: this.state.deadline });
  }

  private changeDeadline(minute: number) {
    if (!minute || isNaN(minute)) {
      return;
    }

    this.saveSetting({ deadline: minute, tolerance: this.state.tolerance });
  }

  private saveSetting(setting: { deadline: number; tolerance: number }) {
    localStorage.setItem(this.storageKey(), JSON.stringify(setting));
    this.updateSetting(setting);
  }

  private updateSetting(setting: { deadline: number; tolerance: number }) {
    this.setState(setting);
  }

  private storageKey() {
    const ctx = this.context as ISiteContextProps;
    const storageKey: string = 'ShieldTradeSetting-' + ctx.account?.address + '-' + ctx.currentNetwork;

    return storageKey;
  }

  render() {
    const settingOverlay = (
      <div className={styles.wrapper}>
        <div className={[styles.box2, styles['flex-col']].join(' ')}>
          <div className={styles.title}>
            <span>Trade Settings</span>
          </div>

          <div className={styles.title2}>
            <span>Slippage Tolerance</span>
          </div>

          <div className={styles.tolerance}>
            <div
              className={`${styles.item} ${this.state.tolerance === 0.5 ? styles.active : ''}`}
              onClick={() => this.clickTolerance(0.5)}
            >
              <span>0.5%</span>
            </div>
            <div
              className={`${styles.item} ${this.state.tolerance === 1 ? styles.active : ''}`}
              onClick={() => this.clickTolerance(1)}
            >
              <span>1%</span>
            </div>
            <div
              className={`${styles.item} ${this.state.tolerance === 3 ? styles.active : ''}`}
              onClick={() => this.clickTolerance(3)}
            >
              <span>3%</span>
            </div>

            <InputNumber className={styles.item} onChange={(val: number) => this.clickTolerance(val)} />
            <span className={styles.text}>%</span>
          </div>

          <div className={styles.title2}>
            <span>Transaction Deadline</span>
          </div>

          <div className={styles.deadline}>
            <InputNumber
              className={styles.input}
              value={this.state.deadline}
              onChange={(val: number) => this.changeDeadline(val)}
            />
            <span className={styles.unit}>min</span>
          </div>
        </div>
      </div>
    );
    const rs = (
      <Dropdown overlay={settingOverlay} placement="bottomLeft" visible={this.state.visible} trigger={[]}>
        <img className={styles.settingIcon} src={SettingIcon} onClick={() => this.clickIcon()} />
      </Dropdown>
    );

    return rs;
  }
}
