import Pool, { IPool } from './pool';
import { Tabs, Button, Row, Col, Select, Input } from 'antd';
import styles from './net.module.less';

const NetPool: IPool = {
  title: 'Net P&L',
  usd: 637,
  coins: [
    {
      label: 'DAI',
      value: 74,
    },
    {
      label: 'USDC',
      value: 3,
    },
    {
      label: 'USDT',
      value: 445,
    },
  ],
};

export default ({ children }: { children?: any }) => {
  return <Pool {...NetPool}>{children}</Pool>;
};
