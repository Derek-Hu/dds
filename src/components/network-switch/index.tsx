import { Component } from 'react';
import styles from './style.module.less';
import ModalRender from '../modal-render/index';
import { Button, Col, Row, Select } from 'antd';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext from '../../layouts/SiteContext';

const Nets = {
  kovan: 'Ethereum Kovan Testnet',
  'BSC-Testnet': 'BSC Testnet',
  'BSC-Mainnet': 'BSC Mainnet',
};

interface IState {
  visible: boolean;
  selectedNetwork: keyof typeof Nets;
}
export default class ConnectWallet extends Component<any, IState> {
  state: IState = {
    visible: false,
    selectedNetwork: 'kovan',
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

  setType = (selectedNetwork: any) => {
    this.setState({
      selectedNetwork,
    });
  };
  switch = () => {
    const { selectedNetwork } = this.state;
    this.context.switNetwork && this.context.switNetwork(selectedNetwork);
  };

  render() {
    const { visible, selectedNetwork } = this.state;
    console.log('selectedNetwork === network', selectedNetwork);
    return (
      <SiteContext.Consumer>
        {({ network }) => (
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
                  <Col key={key} span={24} className={network === key ? styles.active : ''}>
                    <Button onClick={() => this.setType(key)}>
                      {Nets[key as keyof typeof Nets]} {network}
                    </Button>
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
