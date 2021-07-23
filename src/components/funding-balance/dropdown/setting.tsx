import { Dropdown, Icon } from 'antd';
import styles from './setting.style.module.less';
import InputNumber from '../../input/index';
import SiteContext from '../../../layouts/SiteContext';
import { IconClose } from '../../svg/close.icon';
import { IconSetting } from '../../svg/setting.icon';
import { BaseStateComponent } from '../../../state-manager/base-state-component';
import { TradeSetting } from '../../../state-manager/state-types';
import { C } from '../../../state-manager/cache/cache-state-parser';
import { formatMessage } from '../../../locale/i18n';

type IState = {
  visible: boolean;
  setting: TradeSetting | null;
  isChooseSlippage: boolean;

  isSlippageWarn: boolean;
  isDeadlineWarn: boolean;
};

type IProperty = {};

export class Setting extends BaseStateComponent<IProperty, IState> {
  static contextType = SiteContext;
  public readonly clickTolerances = [0.5, 1, 3];
  public readonly defaultSetting: TradeSetting = {
    slippage: 1,
    deadline: 20,
  };

  state: IState = {
    visible: false,
    setting: null,
    isChooseSlippage: true,
    isSlippageWarn: false,
    isDeadlineWarn: false,
  };

  componentDidMount() {
    this.registerState('setting', C.Order.TradeSetting, () => {
      // this.setState({
      // isSlippageWarn: this.setting.slippage > 50,
      // isDeadlineWarn: this.setting.deadline > 180,
      // });
    });
  }

  componentWillUnmount() {
    this.destroyState();
  }

  get setting(): TradeSetting {
    return this.state.setting ? this.state.setting : this.defaultSetting;
  }

  private isChoice(): boolean {
    return this.state.isChooseSlippage && this.clickTolerances.indexOf(this.setting.slippage) >= 0;
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
      num = this.defaultSetting.slippage;
    }

    if (this.setting.slippage === num) {
      return;
    }

    this.setState({ isChooseSlippage: true }, () => {
      this.setSlippage(num);
    });
  }

  // input custom tolerance
  private inputTolerance(num: number) {
    if (!num) {
      return;
    }

    this.setState({ isChooseSlippage: false }, () => {
      this.setSlippage(num);
    });
  }

  // input deadline
  private changeDeadline(minute: number) {
    if (!minute || isNaN(minute)) {
      return;
    }

    minute = Math.round(minute);
    this.setDeadline(minute);
  }

  private setDeadline(deadline: number) {
    C.Order.TradeSetting.set(Object.assign({}, this.setting, { deadline }));
  }

  private setSlippage(slippage: number) {
    C.Order.TradeSetting.set(Object.assign({}, this.setting, { slippage }));
  }

  render() {
    const settingOverlay = (
      <div className={styles.wrapper}>
        <div className={styles.close} onClick={() => this.onClose()}>
          <IconClose />
        </div>

        <div className={[styles.box2, styles['flex-col']].join(' ')}>
          <div className={styles.title}>
            <span>{formatMessage({ id: 'trade-setting' })}</span>
          </div>

          <div className={styles.title2}>
            <span> {formatMessage({ id: 'slippage' })}</span>
          </div>

          <div className={styles.tolerance}>
            <div
              className={`${styles.item} ${this.setting.slippage === this.clickTolerances[0] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[0])}
            >
              <span>{this.clickTolerances[0]}%</span>
            </div>
            <div
              className={`${styles.item} ${this.setting.slippage === this.clickTolerances[1] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[1])}
            >
              <span>{this.clickTolerances[1]}%</span>
            </div>
            <div
              className={`${styles.item} ${this.setting.slippage === this.clickTolerances[2] ? styles.active : ''}`}
              onClick={() => this.clickTolerance(this.clickTolerances[2])}
            >
              <span>{this.clickTolerances[2]}%</span>
            </div>

            <InputNumber
              className={`${styles.toleranceItem} ${this.isChoice() ? '' : styles.active} `}
              value={this.isChoice() ? null : this.setting.slippage}
              min={0}
              max={100}
              onChange={(val: number) => this.inputTolerance(val)}
            />
            <span className={styles.text}>%</span>
          </div>

          {this.state.isSlippageWarn ? (
            <div className={styles.warn}>
              <Icon type="warning" /> {formatMessage({ id: 'warning' })}:
            </div>
          ) : null}

          <div className={styles.title2}>
            <span> {formatMessage({ id: 'deadline' })}</span>
          </div>

          <div className={styles.deadline}>
            <InputNumber
              className={styles.input}
              mustInt={true}
              value={this.setting.deadline}
              onChange={(val: number) => this.changeDeadline(val)}
            />
            <span className={styles.unit}>{formatMessage({ id: 'minute' })}</span>
          </div>

          {this.state.isDeadlineWarn ? (
            <div className={styles.warn}>
              <Icon type="warning" /> {formatMessage({ id: 'warning' })}:
            </div>
          ) : null}
        </div>
      </div>
    );

    const rs = (
      <Dropdown overlay={settingOverlay} placement="bottomRight" visible={this.state.visible} trigger={[]}>
        <div className={styles.settingIcon} onClick={() => this.clickIcon()}>
          <IconSetting />
        </div>
      </Dropdown>
    );

    return rs;
  }
}
