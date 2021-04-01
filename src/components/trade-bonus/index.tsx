import { Button } from 'antd';
import ColumnConvert from '../column-convert/index';
import { format, isNumberLike, formatThree } from '../../util/math';
import { toCamelCase } from '../../util/string';
import dayjs from 'dayjs';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { Component } from 'react';
import { getTradeOrders, closeOrder } from '../../services/trade.service';
import { Form, Row, Col, Select, Descriptions } from 'antd';
import modalStyles from '../funding-balance/modals/style.module.less';
import ModalRender from '../modal-render/index';
import Placeholder from '../placeholder';
import { formatTime } from '../../util/time';
import DTable from '../table/index';

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
      {isNumberLike(val) ? (
        <>
          {format(val)}(
          <span style={{ color }}>
            {flag}
            {Math.abs(percentage)}%
          </span>
          )
        </>
      ) : (
        '-'
      )}
    </span>
  );
};
export default class Balance extends Component<{ curPrice?: number; coin: IUSDCoins }, IState> {
  state: IState = {
    orderCloseVisible: false,
    orders: [],
    page: 1,
    loading: false,
  };

  static contextType = SiteContext;

  UNSAFE_componentWillReceiveProps() {
    console.log('trade orders refresh...');
  }

  loadData = async (page: number, pageSize: number) => {
    return await getTradeOrders(page);
    // this.setState({
    //   loading: true,
    // });
    // const orders = await getTradeOrders(page);
    // this.setState({
    //   orders,
    //   loading: false,
    // });
  };

  columns = ColumnConvert<ITradeRecord, { exercise: any }>({
    column: {
      time: 'Time',
      type: 'Type',
      price: 'Open Price',
      amount: 'Amount',
      cost: 'Funding Fee Cost',
      fee: 'Settlement Fee',
      pl: 'P&L',
      status: 'Status',
      exercise: 'Action',
    },
    attributes: {
      fee: {
        width: '180px',
      },
    },
    render: (value, key, record) => {
      switch (key) {
        case 'time':
          return formatTime(value);
        case 'price':
        case 'amount':
          return format(value);
        case 'fee':
        case 'cost':
          return `${formatThree(value)}(${record.costCoin})`;
        case 'pl':
          return getPL(record[key]);
        case 'status':
          const status = record[key];
          return <span style={{ color: statusColor[status] }}>{status}</span>;
        case 'type':
          const buyShort = record[key].toUpperCase();
          return (
            <span
              style={{
                color: buyShort === 'LONG' ? '#02B464' : buyShort === 'SHORT' ? '#FA4D56' : '#383838',
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

  confirmClose = async () => {
    const { selectedItem } = this.state;
    const { curPrice } = this.props;
    this.orderModalVisible.hide();
    const success = await closeOrder(selectedItem!, curPrice!);
    if (success) {
      // const { page } = this.state;
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  render() {
    const { orderCloseVisible, orders, selectedItem, loading } = this.state;
    const { type, price, amount, pl } = selectedItem || {};
    const { curPrice, coin } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile, timestamp }) => (
          <div className={styles.root}>
            <h2>Orders</h2>
            <div className={styles.tableWpr}>
              <DTable columns={this.columns} timestamp={timestamp} rowKey="id" loadPage={this.loadData} />
              {/* <Table
                loading={loading}
                rowKey="id"
                columns={this.columns}
                pagination={false}
                dataSource={orders}
                scroll={{ x: 1000 }}
              /> */}
            </div>
            <ModalRender
              visible={orderCloseVisible}
              onCancel={this.orderModalVisible.hide}
              height={320}
              footer={null}
              title="Close Position"
              className={modalStyles.commonModal}
            >
              <Descriptions column={{ xs: 24, sm: 24, md: 24 }} colon={false}>
                <Descriptions.Item label="Type" span={24}>
                  {toCamelCase(type)}
                </Descriptions.Item>
                <Descriptions.Item label="Open Price" span={24}>
                  {format(price)}
                </Descriptions.Item>
                <Descriptions.Item label="Amount" span={24}>
                  {format(amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Close Price" span={24}>
                  {format(curPrice)}
                  {coin}
                </Descriptions.Item>
                <Descriptions.Item label="P&L" span={24}>
                  {getPL(pl)}
                </Descriptions.Item>
              </Descriptions>
              <Row className={modalStyles.actionBtns} gutter={[16, 16]} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button onClick={this.orderModalVisible.hide}>CANCEL</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button onClick={this.confirmClose} type="primary">
                    CLOSE POSITION
                  </Button>
                </Col>
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
