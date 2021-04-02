import { PureComponent } from 'react';
import { Table, Icon, Button } from 'antd';
import Placeholder from '../placeholder/index';
import SiteContext from '../../layouts/SiteContext';

interface IState {
  data: PrivatePoolOrder[];
  loading: boolean;
  page: number;
  initLoad: boolean;
  end: boolean;
}

interface IProps {
  columns: any;
  timestamp?: number;
  hasMore: boolean;
  cacheService?: (timestamp: number) => any[] | undefined;
  rowKey: string;
  loadPage: (page: number, pageSize: number) => any;
}

const PageSize = 50;

const getMaxTime = (orders: Array<{ time: number }>) => {
  if (!orders || !orders.length) {
    return -1;
  }
  return orders.reduce((max, item) => {
    if (item.time > max) {
      max = item.time;
    }
    return max;
  }, -1);
};
let timer: any = null;
export default class Balance extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
    page: 1,
    initLoad: true,
    end: false,
  };

  async loadData(append: boolean, hideLoading?: boolean) {
    const { page, data } = this.state;
    const { loadPage, cacheService } = this.props;
    if (append) {
      this.setState({
        initLoad: false,
        loading: hideLoading ? false : true,
      });
      const pageData = await loadPage(page, PageSize);
      console.log('init page, pageSize', page, PageSize);
      let all = (data || []).concat(pageData);
      if (cacheService) {
        const max = getMaxTime(all);
        const pendingOrders = cacheService(max);
        // @ts-ignore
        all = pendingOrders && pendingOrders.length ? pendingOrders.concat(all) : all;
      }
      this.setState({
        data: all,
        loading: false,
        end: pageData && pageData.length === 0,
      });
      return;
    } else {
      this.setState({
        initLoad: hideLoading ? false : true,
        loading: false,
      });
      const pageSize = !data || !data.length ? PageSize : data.length;
      let pageData = await loadPage(1, pageSize);
      if (cacheService) {
        const max = getMaxTime(pageData);
        const pendingOrders = cacheService(max);
        // @ts-ignore
        pageData = pendingOrders && pendingOrders.length ? pendingOrders.concat(pageData) : pageData;
      }
      this.setState({
        data: pageData,
        initLoad: false,
        end: pageData && pageData.length === 0,
      });
    }
    if (cacheService) {
      timer = setTimeout(() => {
        this.loadData(false, true);
      }, 12000);
    }
  }

  async componentDidMount() {
    console.log('dtable componentDidMount...');
    this.loadData(false);
  }

  componentWillUnmount() {
    // @ts-ignore
    if (timer) {
      // @ts-ignore
      clearTimeout(timer);
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      console.log('dtable refresh...');
      this.loadData(false);
    }
  }

  nextPage = () => {
    const { page } = this.state;
    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.loadData(true);
      }
    );
  };

  render() {
    const { loading, end, initLoad, data } = this.state;
    const { columns, rowKey, hasMore } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => {
          return (
            <div>
              {initLoad ? (
                <>
                  <Placeholder width={'95%'} style={{ margin: '3em auto' }} loading={initLoad}>
                    &nbsp;
                  </Placeholder>
                  <Placeholder width={'95%'} style={{ margin: '3em auto' }} loading={initLoad}>
                    &nbsp;
                  </Placeholder>
                </>
              ) : (
                <>
                  <Table
                    rowKey={rowKey}
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    scroll={isMobile ? { x: 800 } : undefined}
                  />
                  {hasMore ? (
                    <p
                      style={{
                        textAlign: 'center',
                        margin: 0,
                        padding: '0 0 2em',
                        background: '#FFF',
                        position: 'relative',
                      }}
                    >
                      {loading ? (
                        <Icon type="loading" />
                      ) : end ? null : (
                        <Button type="link" onClick={this.nextPage}>
                          <span>
                            More&nbsp;
                            <Icon type="down" />
                          </span>
                        </Button>
                      )}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
