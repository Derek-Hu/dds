import { Button, Tabs } from 'antd';
import ColumnConvert from '../column-convert/index';
import { format, isNumberLike, formatThree } from '../../util/math';
import { toCamelCase } from '../../util/string';
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
import { Visible, Hidden } from '../builtin/hidden';
import { getPendingOrders } from '../../util/order-cache';
import { formatMessage } from 'locale/i18n';
import { BaseStateComponent } from '../../state-manager/base-state-component';
import { P } from '../../state-manager/page/page-state-parser';
import { TradeOrderTab } from '../../state-manager/state-types';

const { TabPane } = Tabs;

const statusColor: { [key in IOrderStatus]: string } = {
  ACTIVE: '#333333',
  CLOSED: '#333333',
};

const OrderCategory = {
  active: 'ACTIVE',
  history: 'HISTORY',
};
interface IState {
  orderCloseVisible: boolean;
  orders: ITradeRecord[];
  page: number;
  selectedItem?: ITradeRecord;
  loading: boolean;
  orderCategory: keyof typeof OrderCategory;
  orderTab: TradeOrderTab;
}
type IProps = { curPrice?: number; coin: IUSDCoins };

type TModalKeys = Pick<IState, 'orderCloseVisible'>;

const getPL = (value?: { val: number; percentage: number }) => {
  if (!value) {
    return null;
  }
  const { val, percentage } = value;
  const flag = percentage === 0 ? '' : percentage < 0 ? <span>-</span> : <span>+</span>;
  const color = percentage === 0 ? '#383838' : percentage < 0 ? '#FA4D56' : '#02B464';

  const negative = val <= 0;
  return (
    <span>
      {isNumberLike(val) ? (
        negative ? (
          0
        ) : (
          <>
            {format(val)}(
            <span style={{ color }}>
              {flag}
              {Math.abs(percentage)}%
            </span>
            )
          </>
        )
      ) : (
        '-'
      )}
    </span>
  );
};
export default class TradeOrderList extends BaseStateComponent<IProps, IState> {
  state: IState = {
    orderCloseVisible: false,
    orders: [],
    page: 1,
    loading: false,
    orderCategory: 'active',

    orderTab: P.Trade.Orders.ListTab.get(),
  };

  static contextType = SiteContext;

  componentDidMount() {
    this.registerState('orderTab', P.Trade.Orders.ListTab);
  }

  componentWillUnmount() {
    this.destroyState();
  }

  UNSAFE_componentWillReceiveProps() {
    // console.log('trade orders refresh...');
  }

  loadActiveData = async (page: number, pageSize: number) => {
    return await getTradeOrders(page, 999999, true);
    // this.setState({
    //   loading: true,
    // });
    // const orders = await getTradeOrders(page);
    // this.setState({
    //   orders,
    //   loading: false,
    // });
  };

  loadHistoryData = async (page: number, pageSize: number) => {
    return await getTradeOrders(page, pageSize, false);
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
      time: formatMessage({ id: 'time' }),
      type: formatMessage({ id: 'type' }),
      price: formatMessage({ id: 'open-price' }),
      amount: formatMessage({ id: 'amount' }),
      cost: formatMessage({ id: 'funding-fee-locked' }),
      fee: formatMessage({ id: 'settlement-fee' }),
      pl: formatMessage({ id: 'P&L' }),
      status: formatMessage({ id: 'status' }),
      exercise: formatMessage({ id: 'action' }),
    },
    attributes: {
      fee: {
        width: '180px',
      },
      exercise: {
        fixed: 'right',
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
              {formatMessage({ id: 'close' })}
            </Button>
          ) : null;
        default:
          return value;
      }
    },
  });

  historyColumns = ColumnConvert<ITradeRecord, { closePrice: any; exercise: any }>({
    column: {
      time: formatMessage({ id: 'time' }),
      type: formatMessage({ id: 'type' }),
      price: formatMessage({ id: 'open-price' }),
      amount: formatMessage({ id: 'amount' }),
      closePrice: formatMessage({ id: 'close-price' }),
      cost: formatMessage({ id: 'funding-fee-cost' }),
      fee: formatMessage({ id: 'settlement-fee' }),
      pl: formatMessage({ id: 'P&L' }),
      status: formatMessage({ id: 'status' }),
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
        case 'closePrice':
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

  changeCategory = (type: any) => {
    this.setState({
      orderCategory: type,
    });
  };
  render() {
    const { orderCloseVisible, orders, orderCategory, selectedItem, loading } = this.state;
    const { type, price, amount, pl } = selectedItem || {};
    const { curPrice, coin } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile, timestamp }) => (
          <div className={styles.root}>
            <h2>{formatMessage({ id: 'orders' })}</h2>

            <div className={styles.tableWpr}>
              <Tabs
                className={styles.orderTab}
                defaultActiveKey={orderCategory}
                animated={false}
                onChange={this.changeCategory}
              >
                <TabPane
                  tab={<span className={styles.uppercase}>{OrderCategory.active}</span>}
                  key={OrderCategory.active}
                >
                  <DTable
                    hasMore={false}
                    columns={this.columns}
                    cacheService={getPendingOrders}
                    timestamp={timestamp}
                    rowKey="hash"
                    loadPage={this.loadActiveData}
                  />
                </TabPane>
                <TabPane
                  tab={<span className={styles.uppercase}>{OrderCategory.history}</span>}
                  key={OrderCategory.history}
                >
                  <DTable
                    hasMore={true}
                    columns={this.historyColumns}
                    timestamp={timestamp}
                    rowKey="hash"
                    loadPage={this.loadHistoryData}
                  />
                </TabPane>
              </Tabs>

              {/* <Table
                loading={loading}
                rowKey="id"
                columns={this.columns}
                pagination={false}
                dataSource={orders}
                scroll={{ x: 1000 }}
              /> */}
            </div>
            {/*<ActiveOrderTable />*/}
            <ModalRender
              visible={orderCloseVisible}
              onCancel={this.orderModalVisible.hide}
              height={320}
              footer={null}
              title={formatMessage({ id: 'close-position' })}
              className={modalStyles.commonModal}
            >
              <Descriptions column={1} colon={false}>
                <Descriptions.Item label={formatMessage({ id: 'type' })} span={24}>
                  {toCamelCase(type)}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'open-price' })} span={24}>
                  {format(price)}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'amount' })} span={24}>
                  {format(amount)}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'close-price' })} span={24}>
                  {format(curPrice)}
                  {coin}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'P&L' })} span={24}>
                  {getPL(pl)}
                </Descriptions.Item>
              </Descriptions>
              <Row className={modalStyles.actionBtns} gutter={[16, 16]} type="flex">
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                  <Button onClick={this.orderModalVisible.hide}>{formatMessage({ id: 'cancel' })}</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                  <Button onClick={this.confirmClose} type="primary">
                    {formatMessage({ id: 'close' })}
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
