import { Component } from "react";
import TradeBonus, { IRecord } from "../components/trade-bonus/index";


const data: IRecord[] = [{
  id: '001',
  time: new Date().getTime(),
  type: 'Buy',
  price: 400.65,
  size: 10.36,
  cost: 5.23,
  fee: 0.10,
  pl: {
    val: 10.56,
    percentage: -0.25,
  },
  status: 'LIQUIDATING',
  exercise: '-'
},{
  id: '002',
  time: new Date().getTime(),
  type: 'Buy',
  price: 400.65,
  size: 10.36,
  cost: 5.23,
  fee: 0.10,
  pl: {
    val: 10.56,
    percentage: -0.25,
  },
  status: 'ACTIVE',
  exercise: '-'
},{
  id: '003',
  time: new Date().getTime(),
  type: 'Short',
  price: 400.65,
  size: 10.36,
  cost: 5.23,
  fee: 0.10,
  pl: {
    val: 10.56,
    percentage: 0.25,
  },
  status: 'CLOSED',
  exercise: '-'
}]
export default class TradePage extends Component {
  componentDidMount() {
    console.log("mount");
  }
  render() {
    return (
      <div>
        <TradeBonus data={data} />
      </div>
    );
  }
}
