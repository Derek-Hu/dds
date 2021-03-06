import { Component } from 'react';
import styles from './style.module.less';
import ModalRender from '../modal-render/index';
import { Col, Icon, Row } from 'antd';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext, { ISiteContextProps } from '../../layouts/SiteContext';
import { DefaultKeNetwork } from '../../constant/index';
import { switchNetwork } from '../../services/account';
import { EthNetwork } from '../../constant/network';
import NormalButton from '../common/buttons/normal-btn';

interface IState {
  visible: boolean;
  selectedNetwork: INetworkKey;
}

export default class NetworkSwitch extends Component<any, IState> {
  state: IState = {
    visible: false,
    selectedNetwork: (this.context as ISiteContextProps).currentNetwork || DefaultKeNetwork,
  };

  static contextType = SiteContext;

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };
  openModal = () => {
    this.setState({
      selectedNetwork: (this.context as ISiteContextProps).currentNetwork,
      visible: true,
    });
  };

  componentDidMount() {
    // console.log('NetworkSwitch componentDidMount');
  }

  componentWillUnmount() {
    // console.log('NetworkSwitch componentWillUnmount');
  }

  setType = (selectedNetwork: INetworkKey) => {
    this.setState({
      selectedNetwork,
    });
  };

  switchToBsc = async () => {
    switchNetwork(EthNetwork.bianTest).then(suc => {
      if (suc) {
        this.closeModal();
      }
    });
  };

  render() {
    const { visible, selectedNetwork } = this.state;
    const tips: Record<INetworkKey, any> = {
      bsctest: (
        <span className={styles.tips}>
          Please check your wallet <br />
          Switched to BSC Test Network
        </span>
      ),
      bscmain: (
        <span className={styles.tips}>
          Please check your wallet <br />
          Switched to BSC
        </span>
      ),
      kovan: (
        <span className={styles.tips}>
          Please check your wallet <br />
          Switched to Kovan Test Network
        </span>
      ),
    };

    const wrongNetWork: boolean = this.context.network && this.context.network !== EthNetwork.bianTest;
    const shouldVisible: boolean = this.context.connected && (visible || wrongNetWork);

    return (
      <SiteContext.Consumer>
        {({ network }) => (
          <>
            <ModalRender
              visible={shouldVisible}
              title="Switch Network"
              className={commonStyles.commonModal}
              onCancel={this.closeModal}
              height={300}
              width={500}
              closable={false}
              maskClosable={true}
              footer={null}
            >
              <Row>
                <Col span={24}>
                  <div className={styles.wrong}>
                    <Icon type="warning" />
                    &nbsp;&nbsp;
                    <span>Wrong Network!</span>
                  </div>
                </Col>
              </Row>
              <Row gutter={[16, 24]} className={styles.coinList}>
                <Col span={24}>
                  <NormalButton disabled={true} inModal={true} type={'default'}>
                    Arbitrum Testnet (Coming Soon)
                  </NormalButton>
                </Col>
                <Col span={24} className={styles.active}>
                  <NormalButton inModal={true} marginTop={'0px'} type={'default'}>
                    BSC Testnet
                  </NormalButton>
                </Col>
                <Col span={24}>
                  <NormalButton type="primary" onClick={() => this.switchToBsc()}>
                    Switch To BSC Testnet
                  </NormalButton>
                </Col>
              </Row>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
