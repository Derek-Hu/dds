import { BaseStateComponent } from '../../state-manager/base-state-component';
import { Col, Row } from 'antd';
import Placeholder from '../placeholder';

export class TableLoading extends BaseStateComponent<any, any> {
  render() {
    return (
      <Row gutter={[16, 60]}>
        <Col span={24}>
          <Placeholder width={'95%'} style={{ margin: '0 auto' }} loading={true}>
            &nbsp;
          </Placeholder>
        </Col>

        <Col span={24}>
          <Placeholder width={'95%'} style={{ margin: '0 auto' }} loading={true}>
            &nbsp;
          </Placeholder>
        </Col>
      </Row>
    );
  }
}
