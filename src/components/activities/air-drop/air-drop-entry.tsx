import { Component } from 'react';
import { CircleBorderBtn } from '../../common/buttons/circle-border-btn';
import airdropSvg from '../../../assets/imgs/airdrop/airdrop.svg';
import styles from './air-drop-entry.module.less';

type IState = {};
type IProps = {};

export class AirDropEntry extends Component<IProps, IState> {
  onEnterAirdrop() {}

  render() {
    return (
      <div className={styles.wrapper}>
        <CircleBorderBtn
          paddingHorizon={'5px'}
          paddingVertical={'5px'}
          bgColor={'#1346FF'}
          onClick={this.onEnterAirdrop.bind(this)}
          isLink={true}
          aUrl={'/airdrop.html'}
          aTarget={'_blank'}
        >
          <img className={styles.btnImg} src={airdropSvg} height={18} />
          <span className={styles.btnFont}>Airdrop</span>
        </CircleBorderBtn>
      </div>
    );
  }
}
