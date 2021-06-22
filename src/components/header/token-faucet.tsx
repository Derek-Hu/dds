import { Component } from 'react';
import { Dropdown, Icon } from 'antd';
import { EthNetwork } from '../../constant/network';
import styles from './token-faucet.module.less';
import { CircleBorderBtn } from '../common/buttons/circle-border-btn';
import { ClaimTestToken } from '../activities/claim-test/claim-test-token';

type IProps = {
  network: EthNetwork;
};
type IState = {
  dropdownVisible: boolean;
  claimTestTokenVisible: boolean;
};

export class TokenFaucet extends Component<IProps, IState> {
  state: IState = {
    dropdownVisible: false,
    claimTestTokenVisible: false,
  };

  readonly btnPaddingV = 8;
  readonly btnPaddingH = 20;

  onChangeVisible() {
    this.setState({ dropdownVisible: !this.state.dropdownVisible });
  }

  readonly bscList = (
    <div className={styles.overlayWrapper} style={{ paddingTop: this.btnPaddingV + 'px' }}>
      <ul className={styles.dropList}>
        <li className={styles.dropItem}>
          <a href="https://testnet.binance.org/faucet-smart" rel="noreferrer" target="_blank">
            BSC-faucet
          </a>
        </li>
        <li className={styles.dropItem}>
          <ClaimTestToken>
            <span>5000 Test ShieldDAI</span>
          </ClaimTestToken>
        </li>
      </ul>
    </div>
  );

  readonly kovanList = (
    <div>
      <a href="https://faucet.kovan.network/" rel="noreferrer" target="_blank">
        Kovan-Faucet
      </a>
    </div>
  );

  switchNetworkList() {
    switch (this.props.network) {
      case EthNetwork.kovan: {
        return this.kovanList;
      }
      case EthNetwork.bianTest: {
        return (
          <Dropdown overlay={this.bscList} trigger={['hover']} placement={'bottomCenter'}>
            <div className={styles.dropdownWrapper}>
              <span className={styles.downText}>Claim</span>
              <Icon className={styles.downIcon} type="down" />
            </div>
          </Dropdown>
        );
      }
      default: {
        return <></>;
      }
    }
  }

  render() {
    return (
      <CircleBorderBtn paddingHorizon={this.btnPaddingH + 'px'} paddingVertical={this.btnPaddingV + 'px'}>
        {this.switchNetworkList()}
      </CircleBorderBtn>
    );
  }
}
