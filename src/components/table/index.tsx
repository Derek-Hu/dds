import { PureComponent } from 'react';
import { Table, Icon, Button } from 'antd';
import Placeholder from '../placeholder/index';
import SiteContext from '../../layouts/SiteContext';
import { formatMessage } from 'locale/i18n';

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
  cacheService?: (remoteList: any[]) => any[] | undefined;
  rowKey: string;
  loadPage: (page: number, pageSize: number) => any;
}

const PageSize = 10;

export default class Balance extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
    page: 1,
    initLoad: true,
    end: false,
  };

  timer = null;

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
        const pendingOrders = cacheService(all);
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
        const pendingOrders = cacheService(pageData);
        // @ts-ignore
        pageData = pendingOrders && pendingOrders.length ? pendingOrders.concat(pageData) : pageData;
      }
      this.setState({
        data: pageData,
        initLoad: false,
        end: pageData && pageData.length === 0,
      });
    }
    // @ts-ignore
    this.timer = setTimeout(() => {
      this.loadData(false, true);
    }, 12000);
  }

  async componentDidMount() {
    console.log('dtable componentDidMount...');
    this.loadData(false);
  }

  componentWillUnmount() {
    // @ts-ignore
    if (this.timer) {
      // @ts-ignore
      clearTimeout(this.timer);
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
                <div style={{ height: '166px', background: '#FFF', padding: '3em 0' }}>
                  <Placeholder width={'95%'} style={{ margin: '0 auto' }} loading={initLoad}>
                    &nbsp;
                  </Placeholder>
                  <Placeholder width={'95%'} style={{ margin: '3em auto' }} loading={initLoad}>
                    &nbsp;
                  </Placeholder>
                </div>
              ) : (
                <>
                  <Table
                    rowKey={rowKey}
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    scroll={isMobile ? { x: 'max-content' } : undefined}
                  />
                  {hasMore ? (
                    <>
                      {loading ? (
                        <p
                          style={{
                            textAlign: 'center',
                            margin: 0,
                            padding: '0 0 2em',
                            background: '#FFF',
                            position: 'relative',
                          }}
                        >
                          <Icon type="loading" />
                        </p>
                      ) : end ? null : data && data.length < PageSize ? null : (
                        <p
                          style={{
                            textAlign: 'center',
                            margin: 0,
                            padding: '0 0 2em',
                            background: '#FFF',
                            position: 'relative',
                          }}
                        >
                          <Button type="link" onClick={this.nextPage}>
                            <span>
                              {formatMessage({ id: 'more' })}&nbsp;
                              <Icon type="down" />
                            </span>
                          </Button>
                        </p>
                      )}
                    </>
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
