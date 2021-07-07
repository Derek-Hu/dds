import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';

import sevenImg from '../../../assets/backed-by/seven-x@2x.png';
import hashkeyImg from '../../../assets/backed-by/hashkey@2x.png';
import atImg from '../../../assets/backed-by/at@2x.png';
import lncubaImg from '../../../assets/backed-by/lncuba@2x.png';
import bonfireImg from '../../../assets/backed-by/bonfire@2x.png';

import hoonImg from '../../../assets/backed-by/hoon@2x.png';
import youbiImg from '../../../assets/backed-by/youbi@2x.png';
import shimaImg from '../../../assets/backed-by/shima@2x.png';
import zonffImg from '../../../assets/backed-by/zonff@2x.png';
import okexImg from '../../../assets/backed-by/okex@2x.png';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.partnerItem}>
      <img src={src} />
    </div>
  );
};

export default () => {
  return (
    <div className={styles.asFeature}>
      <div className={styles.featureContent}>
        <h2>As featurred in</h2>
        <Image src={okexImg} />
        <p className={styles.desc}>If you don’t want to get hacked, get a Ledger wallet</p>
        <a className={styles.link}>https://www.ledger.com/</a>
      </div>
    </div>
  );
};
