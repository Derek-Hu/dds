import { BaseStateComponent } from '../../state-manager/base-state-component';
import tables from './table-common.module.less';
import { Button, Icon } from 'antd';
import { formatMessage } from 'locale/i18n';

type IProps = {
  show: boolean;
  loading: boolean;
  onClick: () => void;
};

export class TableMore extends BaseStateComponent<IProps, any> {
  render() {
    return this.props.show ? (
      <div className={tables.more}>
        {this.props.loading ? (
          <Button type="link">
            <Icon type="loading" />
          </Button>
        ) : (
          <Button type="link" onClick={this.props.onClick.bind(this)}>
            <span>
              {formatMessage({ id: 'more' })}&nbsp;
              <Icon type="down" />
            </span>
          </Button>
        )}
      </div>
    ) : null;
  }
}
