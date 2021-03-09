import { Table, Button } from 'antd';
import ColumnConvert from '../column-convert/index';
import { format } from '../../util/math';
import { toCamelCase } from '../../util/string';
import dayjs from 'dayjs';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { Component } from 'react';
import { getTradeOrders } from '../../services/trade.service';
import { Form, Row, Col, Select, Descriptions } from 'antd';
import modalStyles from '../funding-balance/modals/style.module.less';
import ModalRender from '../modal-render/index';

const statusColor: { [key in IOrderStatus]: string } = {
  ACTIVE: '#333333',
  CLOSED: '#333333',
};

interface IState {
  orderCloseVisible: boolean;
  orders: ITradeRecord[];
  page: number;
  selectedItem?: ITradeRecord;
  loading: boolean;
}

type TModalKeys = Pick<IState, 'orderCloseVisible'>;

const getPL = (value?: { val: number; percentage: number }) => {
  if (!value) {
    return null;
  }
  const { val, percentage } = value;
  const flag = percentage === 0 ? '' : percentage < 0 ? <span>-</span> : <span>+</span>;
  const color = percentage === 0 ? '#383838' : percentage < 0 ? '#FA4D56' : '#02B464';
  return (
    <span>
      {format(val)}(
      <span style={{ color }}>
        {flag}
        {Math.abs(percentage)}%
      </span>
      )
    </span>
  );
};
export default class Balance extends Component<{ graphData?: IPriceGraph; coin: IUSDCoins }, IState> {
  state: IState = {
    orderCloseVisible: false,
    orders: [],
    page: 1,
    loading: false,
  };

  async componentDidMount() {
    const { page } = this.state;
    this.setState({
      loading: true,
    });
    const orders = await getTradeOrders(page);
    this.setState({
      orders,
      loading: false,
    });
  }

  columns = ColumnConvert<ITradeRecord, { exercise: any }>({
    column: {
      time: 'Time',
      type: 'Type',
      price: 'Order Price',
      amount: 'Amount',
      cost: 'Funding Cost',
      fee: 'Settlements Fee ($)',
      pl: 'P&L',
      status: 'Status',
      exercise: 'Operation',
    },
    render: (value, key, record) => {
      switch (key) {
        case 'time':
          return dayjs(value).format('YYYY-MM-DD');
        case 'price':
        case 'amount':
        case 'fee':
          return format(value);
        case 'cost':
          return `${format(record.cost)}(${record.costCoin})`;
        case 'pl':
          return getPL(record[key]);
        case 'status':
          const status = record[key];
          return <span style={{ color: statusColor[status] }}>{status}</span>;
        case 'type':
          const buyShort = toCamelCase(record[key]);
          return (
            <span
              style={{
                color: buyShort === 'Short' ? '#02B464' : buyShort === 'Long' ? '#FA4D56' : '#383838',
              }}
            >
              {buyShort}
            </span>
          );
        case 'exercise':
          return record.status === 'ACTIVE' ? (
            <Button type="link" onClick={() => this.orderModalVisible.show(record)}>
              CLOSE
            </Button>
          ) : null;
        default:
          return value;
      }
    },
  });

  setModalVisible = (key: keyof TModalKeys) => {
    return {
      show: (selectedItem: ITradeRecord) =>
        this.setState({
          [key]: true,
          selectedItem,
        }),
      hide: () =>
        this.setState({
          [key]: false,
        }),
    };
  };

  orderModalVisible = this.setModalVisible('orderCloseVisible');

  render() {
    const { orderCloseVisible, orders, selectedItem, loading } = this.state;
    const { type, price, amount, pl } = selectedItem || {};
    const { graphData, coin } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div className={styles.root}>
            <h2>Orders</h2>
            <div className={styles.tableWpr}>
              <Table loading={loading} rowKey="id" columns={this.columns} pagination={false} dataSource={orders} scroll={{ x: 1000 }} />
            </div>
            <ModalRender
              visible={orderCloseVisible}
              onCancel={this.orderModalVisible.hide}
              height={320}
              footer={null}
              title="Close Order"
              className={modalStyles.commonModal}
            >
              <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                <Descriptions.Item label="Type" span={24}>
                  {toCamelCase(type)}
                </Descriptions.Item>
                <Descriptions.Item label="Open Price" span={24}>
                  {price}
                </Descriptions.Item>
                <Descriptions.Item label="Amount" span={24}>
                  {amount}
                </Descriptions.Item>
                <Descriptions.Item label="Close Price" span={24}>
                  {graphData?.price}{coin}
                </Descriptions.Item>
                <Descriptions.Item label="P&L" span={24}>
                  {getPL(pl)}
                </Descriptions.Item>
              </Descriptions>
              <Row className={modalStyles.actionBtns} gutter={[16, 16]} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button onClick={this.orderModalVisible.hide}>Cancel</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button type="primary">Close Order</Button>
                </Col>
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
