import { Icon, Tabs, Row, Col, Input, Button, Modal } from 'antd';
import styles from './campion-pool.module.less';

export default () => {
    return <div className={styles.root}>
        <h2>Campaign Rewards Pool</h2>
        <p>Next distribution time: <span>2020-10-09</span></p>
        <div>
            <Row><Col span={8}></Col><Col className={styles.themeColor} span={8}>Your Share</Col><Col className={styles.themeColor} span={8}>Total</Col></Row>
            <Row><Col span={8}>DAI</Col><Col className={styles.themeColor} span={8}>55</Col><Col span={8}>37</Col></Row>
            <Row><Col span={8}>USDT</Col><Col className={styles.themeColor} span={8}>435</Col><Col span={8}>80</Col></Row>
            <Row><Col span={8}>USDC</Col><Col className={styles.themeColor} span={8}>12</Col><Col span={8}>63</Col></Row>
        </div>
    </div>

}