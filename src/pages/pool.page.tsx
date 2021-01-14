import { Component } from "react";
import { Alert, Modal, Button, Checkbox } from "antd";
import LiquidityPool from "../components/liquidity-pool/index";
import styles from "./style.module.less";

export default class PoolPage extends Component {
  componentDidMount() {
    console.log("mount");
  }

  state = {
    visible: true,
    agreed: false,
  }

  closeAgree = () => {
    this.setState({
      visible: false
    })
  }

  onCheckChange = (e: any) => {
    this.setState({
      agreed: e.target.checked
    })
  }
  render() {
    const { agreed } = this.state;
    return (
      <div>
        <Alert className={styles.poolMsg} message="Private pool is extremely risky. If you are not a hedging expert, please stay away!!!" type="warning" />
        <LiquidityPool />
        <Modal
          visible={this.state.visible}
          title="RISK WARNING"
          className={styles.modal}
          onCancel={this.closeAgree}
          footer={[
            <Button type="primary" disabled={!agreed} onClick={this.closeAgree}>
              I understand and agree
            </Button>
          ]}
        >
          <p>DDerivatives have been audited by Peckshield Your funds are at risk. You can lose up to 100% of the amount that you will provide to the liquidity pools contracts. NEVER provide funds that you can't afford to lose.</p>
          <Checkbox checked={agreed} onChange={this.onCheckChange} className={styles.agree}>I have read and agreed to the disclaimer.</Checkbox>
        </Modal>

      </div>
    );
  }
}
