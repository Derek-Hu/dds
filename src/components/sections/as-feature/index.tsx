import styles from './style.module.less';
import SectionTitle from '../section-title/index';
import { formatMessage } from 'locale/i18n';
import { Row, Col } from 'antd';
import Texty from 'rc-texty';
import { useState, useEffect } from 'react';
import sevenImg from '../../../assets/backed-by/seven-x@2x.png';
import hashkeyImg from '../../../assets/backed-by/hashkey@2x.png';
import atImg from '../../../assets/backed-by/at@2x.png';
import lncubaImg from '../../../assets/backed-by/lncuba@2x.png';
import bonfireImg from '../../../assets/backed-by/bonfire@2x.png';
import animType from 'rc-texty/lib/animTypes';
import hoonImg from '../../../assets/backed-by/hoon@2x.png';
import youbiImg from '../../../assets/backed-by/youbi@2x.png';
import shimaImg from '../../../assets/backed-by/shima@2x.png';
import zonffImg from '../../../assets/backed-by/zonff@2x.png';
import okexImg from '../../../assets/backed-by/okex@2x.png';

import cnbcImg from '../../../assets/as-feature/cnbc-logo.svg';
import coindeskImg from '../../../assets/as-feature/coindesk.svg';
import forbesImg from '../../../assets/as-feature/forbes.svg';
import techcrunckImg from '../../../assets/as-feature/techcrunch.svg';
import newBloombergImg from '../../../assets/as-feature/new-bloomberg-logo.svg';

import QueueAnim from 'rc-queue-anim';

import 'rc-texty/assets/index.css';

const Image = ({ src }: { src: string }) => {
  return (
    <div className={styles.partnerItem}>
      <img src={src} />
    </div>
  );
};

const datas = [
  {
    label: 'If you don’t want to get hacked, get a Ledger wallet',
    icon: techcrunckImg,
  },
  {
    label: `French Crypto Wallet Ledger Is Solving Bitcoin's Biggest Flaw`,
    icon: forbesImg,
  },
  {
    label: 'Ledger makes sure private keys never become accessible to thieves, online or anywhere else',
    icon: newBloombergImg,
  },
  {
    label: 'Ledger removes the risk of being hacked',
    icon: cnbcImg,
  },
  {
    label: 'Combines high-end security with ease of use',
    icon: coindeskImg,
  },
];
export default () => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    nextItem(index);
  }, []);

  const nextItem = (idx: number) => {
    setTimeout(() => {
      const nextVal = idx < datas.length - 1 ? idx + 1 : 0;
      setIndex(nextVal);
      nextItem(nextVal);
    }, 6000);
  };

  const switchIcon = (i: number) => {
    setIndex(i);
  };
  return (
    <div className={styles.asFeature}>
      <div>
        <QueueAnim>
          <div className={styles.featureContent}>
            <div>
              <h2>As featurred in</h2>
              <Image src={datas[index].icon} />
            </div>
            <p className={styles.desc}>
              {/* <Texty type="right" mode="sync"> */}« {datas[index].label} »{/* </Texty> */}
            </p>
          </div>
        </QueueAnim>
        <div className={styles.dots}>
          {datas.map((d, i) => (
            <span key={i} className={i === index ? styles.active : ''} onClick={() => switchIcon(i)}></span>
          ))}
        </div>
      </div>
    </div>
  );
};
