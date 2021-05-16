import { Component } from 'react';
import styles from './style.module.less';
import ModalRender from '../modal-render/index';
import { Button, Col, Icon, Row } from 'antd';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext, { ISiteContextProps } from '../../layouts/SiteContext';
import { DefaultKeNetwork } from '../../constant/index';
import { EthNetwork } from '../../constant/address';
import { switchNetwork } from '../../services/account';

const Nets: Record<INetworkKey, string> = {
  kovan: 'Ethereum Kovan Testnet',
  bsctest: 'BSC Testnet',
  bscmain: 'BSC Mainnet',
};

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
    console.log('NetworkSwitch componentDidMount');
  }

  componentWillUnmount() {
    console.log('NetworkSwitch componentWillUnmount');
  }

  setType = (selectedNetwork: INetworkKey) => {
    this.setState({
      selectedNetwork,
    });
  };
  switch = async () => {
    const { selectedNetwork } = this.state;
    if (this.context.switNetwork) {
      await this.context.switNetwork(selectedNetwork);
    }
  };

  switchToBsc = async (network: INetworkKey) => {
    const chainId = network === 'bsctest' ? EthNetwork.bianTest : EthNetwork.bianTest;
    switchNetwork(chainId).then(suc => {
      this.closeModal();
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
    const isSelectBSC: boolean = selectedNetwork === 'bsctest';

    return (
      <SiteContext.Consumer>
        {({ currentNetwork }) => (
          <>
            <div className={styles.network} onClick={this.openModal}>
              <span className={styles.icon}></span>
              <span>{Nets[currentNetwork]}</span>
              <Icon className={styles.switch} type="down" />
            </div>
            <ModalRender
              visible={visible}
              title="Switch Network"
              className={commonStyles.commonModal}
              onCancel={this.closeModal}
              height={300}
              width={500}
              closable={false}
              maskClosable={true}
              footer={null}
            >
              <Row gutter={[16, 24]} type="flex" className={styles.coinList}>
                {Object.keys(Nets)
                  .filter(k => k !== 'bscmain')
                  .map(key => (
                    <Col key={key} span={24} className={selectedNetwork === key ? styles.active : ''}>
                      <Button onClick={() => this.setType(key as INetworkKey)}>
                        {currentNetwork === key ? <span className={styles.icon}></span> : null}
                        {Nets[key as INetworkKey]}
                      </Button>
                    </Col>
                  ))}

                {currentNetwork === selectedNetwork ? <span></span> : tips[selectedNetwork]}

                {currentNetwork !== selectedNetwork && isSelectBSC ? (
                  <>
                    <Col span={10}>
                      <Button type="default" onClick={this.closeModal}>
                        {' '}
                        Cancel{' '}
                      </Button>
                    </Col>
                    <Col span={14}>
                      <Button type="primary" onClick={() => this.switchToBsc(selectedNetwork)}>
                        Switch To {Nets[selectedNetwork]}
                      </Button>
                    </Col>
                  </>
                ) : (
                  <Col span={24}>
                    <Button type="primary" onClick={this.closeModal}>
                      {' '}
                      OK{' '}
                    </Button>
                  </Col>
                )}
              </Row>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
