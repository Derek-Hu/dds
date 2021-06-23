import { Icon, Button, Switch } from 'antd';
import { Form, Row, Col, Select, Descriptions } from 'antd';
import styles from './locked.module.less';
import SiteContext from '../../layouts/SiteContext';
import { percentage, multiple, isGreaterZero, format, truncated } from '../../util/math';
import { Component } from 'react';
import { getPrivateOrders, addPrivateOrderMargin, getIsUserRejectPrivateOrder } from '../../services/pool.service';
import ColumnConvert from '../column-convert/index';
import ModalRender from '../modal-render/index';
import modalStyles from '../funding-balance/modals/style.module.less';
import InputNumber from '../input/index';
import { formatTime } from '../../util/time';
import DTable from '../table/index';
import { contractAccessor } from '../../wallet/chain-access';

interface IState {
  data: PrivatePoolOrder[];
  loading: boolean;
  modalVisible: boolean;
  selectedItem: PrivatePoolOrder | null;
  addAmount?: number;
  curPrice?: number | null;
  page: number;
  pageSize: number;
  initLoad: boolean;
  end: boolean;
  isTakeOrder: boolean;
  isTakeOrderChangeable: boolean;
  isLoadingTakeOrder: boolean;
}

export default class Balance extends Component<any, IState> {
  state: IState = {
    data: [],
    loading: false,
    modalVisible: false,
    selectedItem: null,
    curPrice: null,
    page: 1,
    pageSize: 50,
    initLoad: true,
    end: false,
    isTakeOrder: true,
    isTakeOrderChangeable: true,
    isLoadingTakeOrder: true,
  };

  static contextType = SiteContext;

  async componentDidMount() {
    // this.loadData();
    this.getIsTakingOrder();
  }

  getIsTakingOrder = async () => {
    const { isReject, isChangeable } = await getIsUserRejectPrivateOrder();
    this.setState({
      isTakeOrder: !isReject,
      isLoadingTakeOrder: false,
      isTakeOrderChangeable: isChangeable,
    });
  };

  loadPage = async (page: number, pageSize: number) => {
    return await getPrivateOrders(page, pageSize, true);
  };
  // async loadData() {
  //   this.setState({
  //     loading: true,
  //   });
  //   const { page, pageSize, data } = this.state;
  //   const pageData = await getPrivateOrders(page, pageSize, true);
  //   const curPrice = process.env.NODE_ENV === 'development' ? 100 : await getCurPrice('DAI');
  //   this.setState({
  //     data: (data || []).concat(pageData),
  //     curPrice,
  //     initLoad: false,
  //     end: pageData && pageData.length === 0,
  //     loading: false,
  //   });
  // }

  setModalVisible = (key: 'modalVisible') => {
    return {
      show: (selectedItem: PrivatePoolOrder) =>
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

  orderModalVisible = this.setModalVisible('modalVisible');

  columns = ColumnConvert<PrivatePoolOrder, { operation: any }>({
    column: {
      orderId: 'Order Id',
      time: 'Time',
      type: 'Type',
      amount: 'Amount',
      lockedAmount: 'Locked Amount',
      openPrice: 'Open Price',
      status: 'Status',
      operation: 'Action',
    },
    attributes: {},
    render: (value, key, record) => {
      switch (key) {
        case 'time':
          return formatTime(value);
        case 'amount':
        case 'openPrice':
          return format(value);
        case 'lockedAmount':
          return `${format(value)} ${record.coin}`;
        case 'operation':
          return record.status === 'ACTIVE' ? (
            <Button type="link" onClick={() => this.orderModalVisible.show(record)}>
              ADD MARGIN
            </Button>
          ) : null;
        default:
          return value;
      }
    },
  });

  confirmAddMargin = async () => {
    const { addAmount, selectedItem } = this.state;

    if (!isGreaterZero(addAmount)) {
      return;
    }
    this.orderModalVisible.hide();
    const success = await addPrivateOrderMargin(selectedItem!, addAmount!);
    if (success) {
      this.context.refreshPage && this.context.refreshPage();
    }
  };

  onOpenAmountChange = (addAmount: number) => {
    this.setState({
      addAmount,
    });
  };

  // checked === true: takingOrders; checked===false: rejectOrders;
  onRejectOrderChange = (checked: boolean) => {
    this.setState({ isLoadingTakeOrder: true });
    contractAccessor.setPriPoolRejectOrder(!checked).subscribe(() => {
      this.getIsTakingOrder();
    });
  };

  render() {
    const { loading, end, initLoad, curPrice, data, modalVisible, addAmount, selectedItem, isTakeOrder } = this.state;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          const max = selectedItem && account?.USDBalance ? account?.USDBalance[selectedItem?.coin] : undefined;
          const marginRate = selectedItem
            ? percentage(selectedItem.lockedAmount, multiple(selectedItem.amount, curPrice))
            : null;
          //@ts-ignore
          const marginTxt = isNaN(marginRate) ? '-' : marginRate + '%';
          return (
            <div className={styles.tableList}>
              <h4>
                Liquidity Locked Detail
                <div className={styles.orderSwitch}>
                  <span className={styles.stateTitle}>Taking Orders: </span>
                  <span className={this.state.isTakeOrder ? styles.stateOff : styles.state}>OFF</span>
                  <Switch
                    disabled={!this.state.isTakeOrderChangeable}
                    defaultChecked={true}
                    checked={isTakeOrder}
                    onChange={this.onRejectOrderChange}
                    loading={this.state.isLoadingTakeOrder}
                  />
                  <span className={this.state.isTakeOrder ? styles.state : styles.stateOff}>ON</span>
                </div>
              </h4>

              <DTable hasMore={true} columns={this.columns} rowKey="orderId" loadPage={this.loadPage} />
              {/* {initLoad ? (
                <>
                  <Placeholder style={{margin: '3em 0'}} loading={loading}>&nbsp;</Placeholder>
                  <Placeholder style={{margin: '3em 0'}} loading={loading}>&nbsp;</Placeholder>
                </>
              ) : (
                <>
                  <Table
                    rowKey="orderId"
                    columns={this.columns}
                    pagination={false}
                    dataSource={data}
                    scroll={isMobile ? { x: 800 } : undefined}
                  />
                  {loading ? (
                    <Button type="link" className={styles.more}>
                      <Icon type="loading" />
                    </Button>
                  ) : end ? null : (
                    <Button type="link" onClick={this.nextPage} className={styles.more}>
                      <span>
                        More&nbsp;
                        <Icon type="down" />
                      </span>
                    </Button>
                  )}
                </>
              )} */}

              <ModalRender
                visible={modalVisible}
                onCancel={this.orderModalVisible.hide}
                height={320}
                footer={null}
                title="Add Margin"
                className={modalStyles.commonModal}
              >
                <Descriptions column={1} colon={false}>
                  <Descriptions.Item label="Order Id">{selectedItem?.orderId}</Descriptions.Item>
                  <Descriptions.Item label="Current margin rate">
                    {/* // @ts-ignore */}
                    {marginTxt}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="Time" >
                  {formatTime(selectedItem?.time)}
                </Descriptions.Item>
                <Descriptions.Item label="Amount" >
                  {format(selectedItem?.amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Locked Amount" >
                  {format(selectedItem?.lockedAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Open Price" >
                  {format(selectedItem?.openPrice)}
                </Descriptions.Item>
                <Descriptions.Item label="Coins" >
                  {selectedItem?.coin}
                </Descriptions.Item> */}
                </Descriptions>
                <Row>
                  <Col>
                    <InputNumber
                      className={styles.orderInput}
                      onChange={this.onOpenAmountChange}
                      placeholder={max ? `Max ${max}` : '0.00'}
                      max={truncated(max)}
                      showTag={true}
                      tagClassName={styles.utilMax}
                      suffix={selectedItem?.coin}
                    />
                  </Col>
                </Row>
                <Row className={modalStyles.actionBtns} gutter={16} type="flex">
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 2 : 1}>
                    <Button onClick={this.orderModalVisible.hide}>CANCEL</Button>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} order={isMobile ? 1 : 2}>
                    <Button onClick={this.confirmAddMargin} type="primary">
                      CONFIRM
                    </Button>
                  </Col>
                </Row>
              </ModalRender>
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
