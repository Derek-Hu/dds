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
  rowKey: string;
  loadPage: (page: number, pageSize: number) => any;
}

const PageSize = 50;
export default class Balance extends PureComponent<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
    page: 1,
    initLoad: true,
    end: false,
  };

  async loadData(append: boolean) {
    const { page, data } = this.state;
    const { loadPage } = this.props;
    if (append) {
      this.setState({
        initLoad: false,
        loading: true,
      });
      const pageData = await loadPage(page, PageSize);
      console.log('init page, pageSize', page, PageSize);
      const all = (data || []).concat(pageData);
      this.setState({
        data: all,
        loading: false,
        end: pageData && pageData.length === 0,
      });
      return;
    } else {
      this.setState({
        initLoad: true,
        loading: false,
      });
      const pageSize = !data || !data.length ? PageSize : data.length;
      console.log('refresh page, pageSize', 1, pageSize);
      const pageData = await loadPage(1, pageSize);
      this.setState({
        data: pageData,
        initLoad: false,
        end: pageData && pageData.length === 0,
      });
    }
  }

  async componentDidMount() {
    console.log('dtable componentDidMount...');
    this.loadData(false);
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
    const { columns, rowKey } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile, account }) => {
          return (
            <div>
              {initLoad ? (
                <>
                  <Placeholder style={{ margin: '3em 0' }} loading={initLoad}>
                    &nbsp;
                  </Placeholder>
                  <Placeholder style={{ margin: '3em 0' }} loading={initLoad}>
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
                  <p style={{ textAlign: 'center', margin: '2em 0' }}>
                    {loading ? (
                      <Button type="link">
                        <Icon type="loading" />
                      </Button>
                    ) : end ? null : (
                      <Button type="link" onClick={this.nextPage}>
                        <span>
                          More&nbsp;
                          <Icon type="down" />
                        </span>
                      </Button>
                    )}
                  </p>
                </>
              )}
            </div>
          );
        }}
      </SiteContext.Consumer>
    );
  }
}
