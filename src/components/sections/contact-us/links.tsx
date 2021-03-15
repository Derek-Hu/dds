import { Icon } from 'antd';
import TelegramIcon from '~/assets/imgs/telegram-app.png';
import DiscordIcon from '~/assets/imgs/discord.png';
import styles from './style.module.less';

export default [
  {
    icon: <Icon type="twitter" style={{ color: '#333333' }} />,
    url: 'https://twitter.com/shield_dao)',
  },
  {
    icon: <Icon type="medium" style={{ color: '#333333' }} />,
    url: 'https://medium.com/@shielddaoofficial',
  },
  {
    icon: <img src={TelegramIcon} alt="" className={styles.icon} />,
    url: 'https://t.me/shielddaoofficial',
  },
  {
    icon: <img src={DiscordIcon} alt="" className={styles.icon} />,
    url: 'https://discord.com/invite/NAbGTHYgMg',
  },
];
