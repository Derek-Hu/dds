import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';

const style = {
    color: '#1346FF',
    fontSize: '18px'
}
const data: IMiningShare = {
    title: 'Available Liquidity',
    // desc: <span>Total Liquidity: <span style={style}>23534.33</span> USD</span>,
    coins: [{
        label: 'DAI',
        percentage: 25,
        val: 37
    },{
        label: 'USDC',
        percentage: 75,
        val: 80
    },{
        label: 'USDT',
        percentage: 55,
        val: 63
    }],
    totalMode: false
}
export default () => {
    return <div>
        <PoolProgress {...data}/>
    </div>
}