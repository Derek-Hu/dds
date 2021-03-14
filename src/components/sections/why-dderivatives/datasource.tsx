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
    name: 'No risk of position lossrity',
    description: '100% compensation in the position loss to resist the risk caused by delayed price',
  },
  {
    icon: <img src={Icon2} alt="" width="66px" />,
    name: 'Non-delivery term',
    description: 'Flexible funding rate without fix delivery date',
  },
  {
    icon: <img src={Icon3} alt="" width="66px" />,
    name: 'Double combined liquidity pool',
    description: 'strong liquidity and low multi-token risk exposure',
  },
];

export const datasourceTwo = [
  {
    icon: <img src={Icon4} alt="" width="66px" />,
    name: 'Security',
    description: 'Non-custodial and transparent transactions',
  },
  {
    icon: <img src={Icon5} alt="" width="66px" />,
    name: 'Borderless',
    description: 'True globalization and permissionless',
  },
  {
    icon: <img src={Icon6} alt="" width="66px" />,
    name: 'Privacy',
    description: 'No registration, KYC or email required.',
  },
];
