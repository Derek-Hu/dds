import { Component } from 'react';
import Pool, { IPool } from './pool';
import { Tabs, Button, Modal, Table, Row, Select, Input, Col } from 'antd';
import styles from './balance.module.less';
import commonStyles from '../funding-balance/modals/style.module.less';
import ColumnConvert from '../column-convert/index';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { CustomTabKey, SupportedCoins } from '../../constant/index';
import ModalRender from '../modal-render/index';
import SiteContext from '../../layouts/SiteContext';
import CardInfo from '../card-info/index';

const { TabPane } = Tabs;
const { Option } = Select;

const BalancePool = {
  title: 'Liquidity Balance',
  items: [
    {
      label: 'DAI',
      value: 647,
    },
    {
      label: 'USDC',
      value: 638,
    },
    {
      label: 'USDT',
      value: 7378,
    },
  ],
};

// const TabName = {
//   Transfer: "TRANSFER",
//   PNL: "PNL",
// };

interface ITransfer {
  time: number;
  type: 'WithDraw' | 'Deposit';
  amount: number;
  balance: number;
}

const columns = ColumnConvert<ITransfer, {}>({
  column: {
    time: 'Time',
    type: 'Type',
    amount: 'Amount',
    balance: 'Balance',
  },
  render(value, key) {
    switch (key) {
      case 'time':
        return dayjs(value).format('YYYY-MM-DD');
      case 'amount':
      case 'balance':
        return numeral(value).format('0,0.0000');
      default:
        return value;
    }
  },
});

const data: ITransfer[] = [
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
  {
    time: new Date().getTime(),
    type: 'WithDraw',
    amount: 100,
    balance: 892.03,
  },
];
export default class PoolPage extends Component<{ isPrivate: boolean }, any> {
  state = {
    withDrawVisible: false,
    recordVisible: false,
  };

  showRecord = () => {
    this.setState({
      recordVisible: true,
    });
  };
  closeRecord = () => {
    this.setState({
      recordVisible: false,
    });
  };

  showWithDraw = () => {
    this.setState({
      withDrawVisible: true,
    });
  };
  closeWithDraw = () => {
    this.setState({
      withDrawVisible: false,
    });
  };

  render() {
    const { isPrivate } = this.props;
    return (
      <SiteContext.Consumer>
        {({ isMobile }) => (
          <div>
            <CardInfo theme="inner" {...BalancePool}>
              <Button type="primary" onClick={this.showWithDraw} className={styles.btn}>
                Withdraw
              </Button>
              <Button type="link" onClick={this.showRecord} className={styles.link}>
                Liquidity Balance Record
              </Button>
            </CardInfo>
            {/* <Pool {...BalancePool} smallSize={true}>
              
            </Pool> */}
            <ModalRender
              visible={this.state.recordVisible}
              title="Liquidity Balance Record"
              className={commonStyles.commonModal}
              onCancel={this.closeRecord}
              height={500}
              width={600}
              footer={null}
            >
              <Tabs defaultActiveKey="DAI" className={styles.innerTab}>
                {SupportedCoins.map((coin) => (
                  <TabPane tab={coin} key={coin}>
                    <Table
                      rowKey="coin"
                      scroll={{ y: 200, x: 600 }}
                      columns={columns}
                      pagination={false}
                      dataSource={data}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </ModalRender>

            <ModalRender
              visible={this.state.withDrawVisible}
              title="Liquidity Withdraw"
              className={commonStyles.commonModal}
              okText={'Claim'}
              height={420}
              onCancel={this.closeWithDraw}
              footer={null}
            >
              <Row gutter={[16, 16]} type="flex" justify="space-between" align="middle">
                <Col xs={24} sm={24} md={6} lg={6}>
                  <Select defaultValue="DAI" style={{ width: '100%', height: 50 }}>
                    {SupportedCoins.map((coin) => (
                      <Option value={coin}>{coin}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18}>
                  <span className={[styles.maxWithdraw, isMobile ? styles.mobile : ''].join(' ')}>
                    Max Withdraw Balance: <span>3278392</span> DAI
                  </span>
                </Col>
                <Col span={24}>
                  <div className={[styles.repay, isMobile ? styles.mobile : ''].join(' ')}>
                    <Input placeholder="Withdraw amount" />
                    {isPrivate ? null : <p>XXX reDAI you need to pay</p>}
                  </div>
                </Col>
              </Row>
              <Row className={commonStyles.actionBtns} gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Button>Cancel</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Button type="primary">Withdraw</Button>
                </Col>
              </Row>
            </ModalRender>
          </div>
        )}
      </SiteContext.Consumer>
    );
  }
}
