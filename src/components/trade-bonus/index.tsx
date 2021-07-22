import { Tabs } from 'antd';
import styles from './style.module.less';
import SiteContext from '../../layouts/SiteContext';
import { formatMessage } from 'locale/i18n';
import { BaseStateComponent } from '../../state-manager/base-state-component';
import { P } from '../../state-manager/page/page-state-parser';
import { TradeOrderTab } from '../../state-manager/state-types';
import { ActiveOrderTable } from '../table/active-order-table';
import { HistoryOrderTable } from '../table/history-order-table';

const { TabPane } = Tabs;

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

  changeCategory = (type: any) => {
    this.setState({
      orderCategory: type,
    });
  };
  render() {
    const { orderCategory } = this.state;
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
                  <ActiveOrderTable />
                </TabPane>
                <TabPane
                  tab={<span className={styles.uppercase}>{OrderCategory.history}</span>}
                  key={OrderCategory.history}
                >
                  <HistoryOrderTable />
                </TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
