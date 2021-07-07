import { Icon } from 'antd';
import TelegramIcon from '~/assets/telegram.png';
import DiscordIcon from '~/assets/discord.png';
import TwitterIcon from '~/assets/twitter.png';
import MediumIcon from '~/assets/medium.png';
import styles from './style.module.less';

export default [
  {
    icon: <img src={TwitterIcon} alt="" className={styles.icon} />,
    url: 'https://twitter.com/shield_dao',
  },
  {
    icon: <img src={MediumIcon} alt="" className={styles.icon} />,
    url: 'https://shield-dao.medium.com/',
  },
  {
    icon: <img src={TelegramIcon} alt="" className={styles.icon} />,
    url: 'https://t.me/shielddaoofficial',
  },
  {
    icon: <img src={DiscordIcon} alt="" className={styles.icon} />,
    url: 'https://discord.gg/YJ9MHs6YdJ',
  },
];
