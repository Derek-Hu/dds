import { Icon } from 'antd';
import Icon1 from '~/assets/imgs/icon1.png';
import Icon2 from '~/assets/imgs/icon2.png';
import Icon3 from '~/assets/imgs/icon3.png';
import Icon4 from '~/assets/imgs/icon4.png';
import Icon5 from '~/assets/imgs/icon5.png';
import Icon6 from '~/assets/imgs/icon6.png';

export const datasourceOne = [
  {
    icon: <img src={Icon1} alt="" width="66px" />,
    name: '0 position loss',
    description: '100% cover from position loss due to latency price feed',
  },
  {
    icon: <img src={Icon2} alt="" width="66px" />,
    name: 'No expiration date',
    description: 'Flexible funding rate without fix delivery date',
  },
  {
    icon: <img src={Icon3} alt="" width="66px" />,
    name: 'Dual Liquidity Pools',
    description: 'Strong liquidity and low LP mining risk',
  },
];

export const datasourceTwo = [
  {
    icon: <img src={Icon4} alt="" width="66px" />,
    name: 'Secure',
    description: 'Non-custodial and transparent transactions',
  },
  {
    icon: <img src={Icon5} alt="" width="66px" />,
    name: 'Trustless',
    description: 'Verified on-chain settlement and fully-decentralized',
  },
  {
    icon: <img src={Icon6} alt="" width="66px" />,
    name: 'Privacy',
    description: 'No registration, KYC or email required.',
  },
];
