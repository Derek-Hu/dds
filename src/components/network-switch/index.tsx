import { Component } from 'react';
import styles from './style.module.less';
import ModalRender from '../modal-render/index';
import { Button, Col, Row, Select } from 'antd';
import commonStyles from '../funding-balance/modals/style.module.less';
import SiteContext, { ISiteContextProps } from '../../layouts/SiteContext';
import { DefaultKeNetwork } from '../../constant/index';

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

  render() {
    const { visible, selectedNetwork } = this.state;
    return (
      <SiteContext.Consumer>
        {({ currentNetwork }) => (
          <>
            <div className={styles.network}>
              <span className={styles.icon}></span>
              {Nets[currentNetwork]}
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
                  <Col key={key} span={24} className={selectedNetwork === key ? styles.active : ''}>
                    <Button onClick={() => this.setType(key as INetworkKey)}>
                      {currentNetwork === key ? <span className={styles.icon}></span> : null}
                      {Nets[key as INetworkKey]}
                    </Button>
                  </Col>
                ))}
                <Col span={24}>
                  <Button type="primary" onClick={() => this.switch()}>
                    Switch Network
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
