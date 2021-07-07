import Icon1 from '~/assets/imgs/icon1.png';
import Icon2 from '~/assets/imgs/icon2.png';
import Icon3 from '~/assets/imgs/icon3.png';
import Icon4 from '~/assets/imgs/icon4.png';
import Icon5 from '~/assets/imgs/icon5.png';
import Icon6 from '~/assets/imgs/icon6.png';
import { formatMessage } from 'locale/i18n';

export const datasourceOne = [
  {
    icon: <img src={Icon1} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section1-1' }),
    description: formatMessage({ id: 'shield-ads-section1-1-desc' }),
  },
  {
    icon: <img src={Icon2} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section1-2' }),
    description: formatMessage({ id: 'shield-ads-section1-2-desc' }),
  },
  {
    icon: <img src={Icon3} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section1-3' }),
    description: formatMessage({ id: 'shield-ads-section1-3-desc' }),
  },
];

export const datasourceTwo = [
  {
    icon: <img src={Icon4} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section2-1' }),
    description: formatMessage({ id: 'shield-ads-section2-1-desc' }),
  },
  {
    icon: <img src={Icon5} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section2-1' }),
    description: formatMessage({ id: 'shield-ads-section2-2-desc' }),
  },
  {
    icon: <img src={Icon6} alt="" width="66px" />,
    name: formatMessage({ id: 'shield-ads-section2-1' }),
    description: formatMessage({ id: 'shield-ads-section2-3-desc' }),
  },
];
