import { Component } from 'react';
import styles from './style.module.less';
import ModalRender from '../modal-render/index';
import { Button, Col, Row, Select } from 'antd';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext, { ISiteContextProps } from '../../layouts/SiteContext';
import { DefaultKeNetwork } from '../../constant/index';

const Nets: Record<INetworkKey, string> = {
  kovan: 'Ethereum Kovan Testnet',
  'bsc-testnet': 'BSC Testnet',
  'bsc-mainnet': 'BSC Mainnet',
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
  switch = () => {
    const { selectedNetwork } = this.state;
    this.context.switNetwork && this.context.switNetwork(selectedNetwork);
  };

  render() {
    const { visible } = this.state;
    return (
      <SiteContext.Consumer>
        {({ currentNetwork }) => (
          <>
            <div className={styles.network} onClick={this.openModal}>
              <span className={styles.icon}></span>Kovan
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
                {Object.keys(Nets).map(key => (
                  <Col key={key} span={24} className={currentNetwork === key ? styles.active : ''}>
                    <Button onClick={() => this.setType(key as INetworkKey)}>{Nets[key as INetworkKey]}</Button>
                  </Col>
                ))}
                <Col span={24}>
                  <Button type="primary" onClick={() => this.switch()}>
                    Connect Wallet
                  </Button>
                </Col>
              </Row>
            </ModalRender>
          </>
        )}
      </SiteContext.Consumer>
    );
  }
}
