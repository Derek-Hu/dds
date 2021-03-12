import { Observable } from 'rxjs';
import { BigNumber } from 'ethers';

export const ABI = [
  {
    inputs: [
      {
        internalType: 'contract PublicDAIPool',
        name: '_pubPool',
        type: 'address',
      },
      {
        internalType: 'contract PrivateDAIPool',
        name: '_priPool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'openNum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'exchgFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'openFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'closePrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'contractType',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'status',
        type: 'uint256',
      },
    ],
    name: 'DDSCloseContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toAddr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'motageAmount',
        type: 'uint256',
      },
    ],
    name: 'DDSDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'openNum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'exchgFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'openFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'contractType',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'status',
        type: 'uint256',
      },
    ],
    name: 'DDSOpenContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toAddr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'motageAmount',
        type: 'uint256',
      },
    ],
    name: 'DDSWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'addFeesForUser',
    outputs: [
      {
        internalType: 'bool',
        name: 'succ',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'newHoldFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'openTime',
        type: 'uint256',
      },
    ],
    name: 'calculatPeriods',
    outputs: [
      {
        internalType: 'uint256',
        name: 'periods',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'checkOrder',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpFlag',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'checkOrderIsAtRisk',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'closeContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'enum IDDSCommon.ContractType',
        name: 'contractType',
        type: 'uint8',
      },
    ],
    name: 'creatContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
    ],
    name: 'fees',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'exchgFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'openFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'formular',
    outputs: [
      {
        internalType: 'contract Formular',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalanceByAddr',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'getCloseHoldFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
    ],
    name: 'getCurrPriceByEx',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'getHoldFeeByOrderID',
    outputs: [
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'poolType',
        type: 'uint256',
      },
    ],
    name: 'getLockedAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'marginFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'forceFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'getLpMarginAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'marginAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'getLpMarginAmountAndMarginFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'marginAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'marginFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeEx',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'getMaxOpenAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'openPrice',
        type: 'uint256',
      },
    ],
    name: 'getOpenPositionFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'getOrderInfo',
    outputs: [
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
      {
        internalType: 'address payable',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'exFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'newLockFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'openPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'marginAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'marginFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'closePrice',
        type: 'uint256',
      },
      {
        internalType: 'enum IDDSCommon.ContractType',
        name: 'contractType',
        type: 'uint8',
      },
      {
        internalType: 'enum IDDSContract.State',
        name: 'state',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOrdersLen',
    outputs: [
      {
        internalType: 'uint256',
        name: 'ordersLen',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPriceByETHDAI',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPriceByWBTCDAI',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'getUserOrderID',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'orderIDs',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUserOrderIDs',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'orderIDs',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'migrationContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'payProfit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'privPool',
    outputs: [
      {
        internalType: 'contract PrivateDAIPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pubPool',
    outputs: [
      {
        internalType: 'contract PublicDAIPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'repayFudAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'orderIDs',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'riskControl',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchageType',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'setExchageAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract Formular',
        name: '_formular',
        type: 'address',
      },
    ],
    name: 'setFormular',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddr',
        type: 'address',
      },
    ],
    name: 'setPoolTokenAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract PrivateDAIPool',
        name: '_priPool',
        type: 'address',
      },
    ],
    name: 'setPrivatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract PublicDAIPool',
        name: '_pubPool',
        type: 'address',
      },
    ],
    name: 'setPublicPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_repayFudAddr',
        type: 'address',
      },
    ],
    name: 'setrepayFudAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniswapRouter',
    outputs: [
      {
        internalType: 'contract IUniswapV2Router01',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userAccount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

/**
 * 合约接口
 */
export interface ContractProxy {
  getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  depositToken(count: number, coin: IUSDCoins): Observable<boolean>;

  withdrawToken(count: number, coin: IUSDCoins): Observable<boolean>;

  createContract(param: ContractParam): Observable<boolean>;
}

export interface UserAccountInfo {
  deposit: BigNumber;
  available: BigNumber;
}

export interface ContractParam {
  exchangeType: 'ETHDAI';
  number: BigNumber;
  contractType: 1 | 2;
}
