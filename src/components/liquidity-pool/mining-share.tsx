import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';
import { formatMessage } from 'locale/i18n';

const data: IMiningShare = {
  title: formatMessage({ id: 'your-liquidity-mining-share' }),
  coins: [
    {
      label: 'DAI',
      percentage: 25,
      val: 37,
    },
    {
      label: 'USDC',
      percentage: 75,
      val: 80,
    },
    {
      label: 'USDT',
      percentage: 55,
      val: 63,
    },
  ],
  totalMode: false,
  loading: false,
};
export default () => {
  return (
    <div>
      <PoolProgress {...data} />
    </div>
  );
};
