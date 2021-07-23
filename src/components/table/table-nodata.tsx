import { BaseStateComponent } from '../../state-manager/base-state-component';
import { Empty } from 'antd';
import { formatMessage } from '../../locale/i18n';

export class TableNodata extends BaseStateComponent<any, any> {
  render() {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={formatMessage({ id: 'no-data' })} />;
  }
}
