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
            BNB-Faucet
          </a>
        </li>
        <li className={styles.dropItem}>
          <ClaimTestToken>
            <span>Test ShieldDAI</span>
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
      case EthNetwork.bianTest: {
        return (
          <Dropdown overlay={this.bscList} trigger={['hover']} placement={'bottomCenter'}>
            <div className={styles.dropdownWrapper}>
              <span className={styles.downText}>Testnet Token</span>
              <Icon className={styles.downIcon} type="down" style={{ fontSize: '14px' }} />
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
