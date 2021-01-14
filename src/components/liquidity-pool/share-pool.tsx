import PoolProgress, { IMiningShare } from '../progress-bar/pool-progress';

const style = {
    color: '#1346FF',
    fontSize: '18px'
}
const data: IMiningShare = {
    title: 'Your Share in the Pool',
    desc: <span>Total Liquidity: <span style={style}>23534.33</span> USD</span>,
    coins: [{
        label: 'reDAI',
        percentage: 25,
        val: <span>37863/ 65349</span>
    },{
        label: 'reUSDC',
        percentage: 75,
        val: <span>37863/ 65349</span>
    },{
        label: 'reUSDT',
        percentage: 55,
        val: <span>37863/ 65349</span>
    }],
    totalMode: true
}
export default () => {
    return <div>
        <PoolProgress {...data}/>
    </div>
}