import { Component } from 'react';
import { Table, Icon, Button } from 'antd';
import Placeholder from '../placeholder/index';
import SiteContext from '../../layouts/SiteContext';

interface IState {
  data: PrivatePoolOrder[];
  loading: boolean;
  page: number;
  pageSize: number;
  initLoad: boolean;
  end: boolean;
}

interface IProps {
  columns: any;
  rowKey: string;
  loadPage: (page: number, pageSize: number) => any;
}

export default class Balance extends Component<IProps, IState> {
  state: IState = {
    data: [],
    loading: false,
    page: 1,
    pageSize: 50,
    initLoad: true,
    end: false,
  };

  async loadData() {
    this.setState({
      loading: true,
    });
    const { page, pageSize, data } = this.state;
    const { loadPage } = this.props;

    const pageData = await loadPage(page, pageSize);
    this.setState({
      data: (data || []).concat(pageData),
      initLoad: false,
      end: pageData && pageData.length === 0,
      loading: false,
    });
  }

  async componentDidMount() {
    this.loadData();
  }

  nextPage = () => {
    const { page, pageSize } = this.state;
    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.loadData();
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
                  <Placeholder style={{ margin: '3em 0' }} loading={loading}>
                    &nbsp;
                  </Placeholder>
                  <Placeholder style={{ margin: '3em 0' }} loading={loading}>
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
                  <p style={{textAlign: 'center', margin: '2em 0'}}>
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
