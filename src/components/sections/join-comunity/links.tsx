import { Icon } from 'antd';
import TelegramIcon from '~/assets/join-community/3.svg';
import DiscordIcon from '~/assets/join-community/2.svg';
import TwitterIcon from '~/assets/join-community/1.svg';
import MediumIcon from '~/assets/join-community/4.svg';
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
