import { Component } from 'react';
import { Dropdown } from 'antd';
import styles from './setting.style.module.less';
import InputNumber from '../../input/index';
import SiteContext from '../../../layouts/SiteContext';
import { readTradeSetting, writeTradeSetting } from '../../../services/local-storage.service';
import { IconClose } from '../../svg/close.icon';
import { IconSetting } from '../../svg/setting.icon';

type IState = {
  visible: boolean;
  tolerance: number;
  customTolerance: number | null;
  deadline: number;
  deadlineValid: boolean; // TODO 当不合法时，收起后，要恢复原来的数值显示
};

type IProperty = {};

export class Setting extends Component<IProperty, IState> {
  static contextType = SiteContext;
  public readonly defaultTolerance = 1; // 默认1%
  public readonly defaultDeadline = 20; // default to 20 minutes
  public readonly clickTolerances = [0.5, 1, 3];

  state: IState = {
    visible: false,
    tolerance: this.defaultTolerance,
    customTolerance: null,
    deadline: this.defaultDeadline,
    deadlineValid: true,
  };

  componentWillUpdate() {
    this.readSetting();
  }

  private isInClickTolerance(num: number): boolean {
    return this.clickTolerances.indexOf(num) >= 0;
  }

  // get trade setting from local storage
  private readSetting() {
    const setting: TradeSetting | null = readTradeSetting();

    if (setting) {
      const eq: boolean = this.state.deadline === setting.deadline && this.state.tolerance === setting.tolerance;
      if (!eq) {
        // update state if need
        this.updateSetting(setting);
      }
    }
  }

  // show or hide modal
  private clickIcon() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  private onClose() {
    this.setState({ visible: false });
  }

  // choose tolerance value
  private clickTolerance(num: number) {
    if (!num) {
      num = this.defaultTolerance;
    }

    if (this.state.tolerance === num) {
      return;
    }

    this.setState({ customTolerance: null });
    this.saveTolerance(num);
  }

  // input custom tolerance
  private inputTolerance(num: number) {
    if (!num) {
      if (!this.isInClickTolerance(this.state.tolerance)) {
        this.saveTolerance(this.defaultTolerance);
      }
      return;
    }

    this.setState({ customTolerance: num });

    this.saveTolerance(num);
  }

  // input deadline
  private changeDeadline(minute: number) {
    if (!minute || isNaN(minute)) {
      this.setState({ deadlineValid: false });
      return;
    }

    minute = Math.round(minute);
    this.saveSetting({ deadline: minute, tolerance: this.state.tolerance });
  }

  private saveTolerance(tolerance: number) {
    this.saveSetting({ tolerance: tolerance, deadline: this.state.deadline });
  }

  // save to local storage
  private saveSetting(setting: TradeSetting) {
    // @1 must save to storage first
    writeTradeSetting(setting);
    // @2
    this.updateSetting(setting);
  }

  // update setting state
  private updateSetting(setting: { deadline: number; tolerance: number }) {
    this.setState(setting);
  }

  render() {
    const settingOverlay = (
      <div className={styles.wrapper}>
        <div className={styles.close} onClick={() => this.onClose()}>
          <IconClose />
        </div>

        <div className={[styles.box2, styles['flex-col']].join(' ')}>
          <div className={styles.title}>
            <span>Trade Settings</span>
          </div>

          <div className={styles.title2}>
            <span>Slippage Tolerance</span>
          </div>

          <div className={styles.tolerance}>
            <div
              className={`${styles.item} ${this.state.tolerance === this.clickTolerances[0] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[0])}
            >
              <span>{this.clickTolerances[0]}%</span>
            </div>
            <div
              className={`${styles.item} ${this.state.tolerance === this.clickTolerances[1] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[1])}
            >
              <span>{this.clickTolerances[1]}%</span>
            </div>
            <div
              className={`${styles.item} ${this.state.tolerance === this.clickTolerances[2] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[2])}
            >
              <span>{this.clickTolerances[2]}%</span>
            </div>

            <InputNumber
              className={`${styles.toleranceItem} ${
                this.isInClickTolerance(this.state.tolerance) ? '' : styles.active
              } `}
              value={this.state.customTolerance}
              onChange={(val: number) => this.inputTolerance(val)}
            />
            <span className={styles.text}>%</span>
          </div>

          <div className={styles.title2}>
            <span>Transaction Deadline</span>
          </div>

          <div className={styles.deadline}>
            <InputNumber
              className={styles.input}
              mustInt={true}
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
        <div className={styles.settingIcon} onClick={() => this.clickIcon()}>
          <IconSetting />
        </div>
      </Dropdown>
    );

    return rs;
  }
}
