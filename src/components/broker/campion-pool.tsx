import styles from './campion-pool.module.less';
import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';

  const data: IMiningShare = {
    title: 'Campaign Rewards Pool',
    desc: <div>
        <p className="text-center">Next distribution time<br/><span>2020-10-09</span></p>,
        <p className={styles.shareTotalTip}>
            <span>
                Your
                <br />
                share
            </span>
            <span>
                Total
                <br />
                Locked
            </span>
        </p>
    </div>,
    coins: [{
        label: 'DAI',
        percentage: 25,
        val: <span>647</span>
    },{
        label: 'USDC',
        percentage: 75,
        val: <span>65349</span>
    },{
        label: 'USDT',
        percentage: 55,
        val: <span>37863</span>
    }],
    totalMode: true
}

export default () => {
    return <div>
        <PoolProgress {...data}/>
        {/* <h2>Campaign Rewards Pool</h2>
        
        <div>
            <Row><Col span={8}></Col><Col className="color-3 font-w-bold" span={8}>Your Share</Col><Col className="font-w-bold color-3" span={8}>Total</Col></Row>
            <Row><Col span={8}>DAI</Col><Col className={styles.themeColor} span={8}>55</Col><Col span={8}>37</Col></Row>
            <Row><Col span={8}>USDT</Col><Col className={styles.themeColor} span={8}>435</Col><Col span={8}>80</Col></Row>
            <Row><Col span={8}>USDC</Col><Col className={styles.themeColor} span={8}>12</Col><Col span={8}>63</Col></Row>
        </div> */}
    </div>

}