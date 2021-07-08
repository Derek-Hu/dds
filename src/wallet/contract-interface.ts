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
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
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
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'DDSMigrationContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
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
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
    ],
    name: 'DDSRiskHandler',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'SetFormular',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'SetrepayFudAddr',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DDSBrokerAddr',
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
    inputs: [],
    name: 'DDSLiquidorAddr',
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
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'intervalDay',
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
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'calculatIntervalDay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
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
    ],
    name: 'closecontract',
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
      {
        internalType: 'address',
        name: 'inviter',
        type: 'address',
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
      {
        internalType: 'enum IDDSCommon.ContractType',
        name: 'contractType',
        type: 'uint8',
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
        name: 'exchangeType',
        type: 'uint256',
      },
    ],
    name: 'getExchageName',
    outputs: [
      {
        internalType: 'string',
        name: 'strExchgName',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'exchangeName',
        type: 'string',
      },
    ],
    name: 'getExchangeType',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
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
      {
        internalType: 'uint256',
        name: 'intervalDay',
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
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'getLastMigrationTime',
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
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentPrice',
        type: 'uint256',
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
      {
        internalType: 'enum IDDSCommon.ContractType',
        name: 'contractType',
        type: 'uint8',
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
      {
        internalType: 'enum IDDSCommon.ContractType',
        name: 'contractType',
        type: 'uint8',
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
        name: 'exType',
        type: 'string',
      },
      {
        internalType: 'address',
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
    name: 'getPriceByBTCDAI',
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
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'orderIDs',
        type: 'uint256[]',
      },
    ],
    name: 'migrationContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'migrationInfo',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'orders',
    outputs: [
      {
        internalType: 'address payable',
        name: 'holder',
        type: 'address',
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
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'closePrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    ],
    name: 'riskControl',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'riskFundAddr',
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
        name: '_DDSLiquidorAddr',
        type: 'address',
      },
    ],
    name: 'setDDSLiquidorAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_DDSBrokerAddr',
        type: 'address',
      },
    ],
    name: 'setDDSbrokerAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'exchageType',
        type: 'uint8',
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
    name: 'setRepayFudAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_riskFundAddr',
        type: 'address',
      },
    ],
    name: 'setRiskFundAddr',
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
export const Pl1ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'writeAmount',
        type: 'uint256',
      },
    ],
    name: 'Provide',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ProvideLP2',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'addressExist',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'addressIndex',
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
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
    ],
    name: 'close',
    outputs: [
      {
        internalType: 'uint256',
        name: 'userProfit',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
    ],
    name: 'geMarginAmount',
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
    inputs: [],
    name: 'getLPAmountInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'deposit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availabe',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'locked',
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
    name: 'getMatchID',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpID',
        type: 'uint256',
      },
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
        name: 'mintAmount',
        type: 'uint256',
      },
    ],
    name: 'getMintReDaiAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'mintOtoken',
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
        name: 'tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'getReTokenAmountByToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'retokenAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRiskFundAmount',
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
        name: 'reTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'getTokenAmountByreToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
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
    name: 'getUserReToeknInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'selfReToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getlockedLiquidityLen',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpLen',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'a',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'b',
        type: 'string',
      },
    ],
    name: 'isEqual',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keeper',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'lastProvideTm',
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
        name: 'id',
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
    ],
    name: 'lock',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lockedLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'takerId',
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
        name: 'pubOrPrivate',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'makerAddr',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'locked',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockupPeriod',
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
    name: 'lp2Keeper',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'lpAccount',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'matchIds',
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
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'moveProfit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'movePrice',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'exchangeType',
        type: 'string',
      },
    ],
    name: 'moveLp1Fund',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
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
    inputs: [],
    name: 'pl1AvailAmount',
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
    name: 'pl1lockedAmount',
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
    name: 'plDepositTotal',
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
        name: 'mintAmount',
        type: 'uint256',
      },
    ],
    name: 'provide',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currPrice',
        type: 'uint256',
      },
    ],
    name: 'riskClose',
    outputs: [
      {
        internalType: 'bool',
        name: 'flag',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'userProfit',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'riskFundAddr',
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
        name: '_keeperAddr',
        type: 'address',
      },
    ],
    name: 'setKeeper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lp2KeeperAddr',
        type: 'address',
      },
    ],
    name: 'setLP2Keeper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
    ],
    name: 'setLockupPeriod',
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
        internalType: 'address',
        name: '_riskFundAddr',
        type: 'address',
      },
    ],
    name: 'setRiskFundAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenAddress',
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
    inputs: [],
    name: 'totalBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
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
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'reTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: 'reAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export const Pl2ABI = [
  {
    inputs: [
      {
        internalType: 'contract PublicDAIPool',
        name: '_lp1',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'writeAmount',
        type: 'uint256',
      },
    ],
    name: 'Provide',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ProvideLP2',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DDSRewardsAddr',
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
    inputs: [],
    name: 'accIndex',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'addMarginAmount',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'addressExist',
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
    ],
    name: 'close',
    outputs: [
      {
        internalType: 'uint256',
        name: 'userProfit',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'geMarginAmount',
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
    inputs: [],
    name: 'getLPAmountInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'deposit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availabe',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'locked',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLPLocked',
    outputs: [
      {
        internalType: 'uint256',
        name: 'locked',
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
    name: 'getMatchID',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpID',
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
    name: 'getMatchLp2Object',
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
    inputs: [],
    name: 'getRiskFundAmount',
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
    name: 'getlockedLiquidityLen',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lpLen',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keeper',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'lastProvideTm',
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
        name: 'id',
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
        name: 'exchgFee',
        type: 'uint256',
      },
    ],
    name: 'lock',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lockedLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'takerId',
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
        internalType: 'address',
        name: 'makerAddr',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'locked',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockupPeriod',
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
    name: 'lp1',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'lpAccount',
    outputs: [
      {
        internalType: 'address payable',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockedAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isRejectOrder',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lpAddrs',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'matchIds',
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
        name: 'mintAmount',
        type: 'uint256',
      },
    ],
    name: 'provide',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'number',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'holdFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currPrice',
        type: 'uint256',
      },
    ],
    name: 'riskClose',
    outputs: [
      {
        internalType: 'bool',
        name: 'flag',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'userProfit',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'riskFundAddr',
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
        internalType: 'bool',
        name: 'flag',
        type: 'bool',
      },
    ],
    name: 'setIsRejectOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_keeperAddr',
        type: 'address',
      },
    ],
    name: 'setKeeper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
    ],
    name: 'setLockupPeriod',
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
        internalType: 'contract PublicDAIPool',
        name: '_lp1',
        type: 'address',
      },
    ],
    name: 'setPublicPoolAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_riskFundAddr',
        type: 'address',
      },
    ],
    name: 'setRiskFundAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenAddress',
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
    inputs: [],
    name: 'totalBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
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
export const RewardsABI = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token',
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
        indexed: false,
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'CalcAndSendRewardsForLP1',
    type: 'event',
  },
  {
    inputs: [],
    name: 'TOTAL_REWARDS',
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
        name: 'lp',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'calcAndSendRewardsForLP1',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lp',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'orderFee',
        type: 'uint256',
      },
    ],
    name: 'calcAndSendRewardsForLP2',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'liquidor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'gasUsedByStable',
        type: 'uint256',
      },
    ],
    name: 'calcAndSendRewardsForLiquidor',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewardsForLP2',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ddsLocked',
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
    name: 'ddsPriceForRewardsDenominator',
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
    name: 'ddsPriceForRewardsNumerator',
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
    name: 'ddsShareForRewardsDenominator',
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
    name: 'ddsShareForRewardsNumerator',
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
    name: 'ddsThreshold',
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
    name: 'ddsUnlocked',
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
    name: 'ddsUnlockedForLP2',
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
    name: 'ddsUnlockedForLp1',
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
    name: 'getParmsAfterHalving',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    name: 'getTotalCouldClaimed',
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
    name: 'getTotalMinted',
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
    name: 'getUnlockInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    name: 'halveTime',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lpsInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'oriTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'share',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reTokenAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'queryRewardsForAllLiquidors',
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
        name: 'lp',
        type: 'address',
      },
    ],
    name: 'queryRewardsForLP1',
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
        name: 'lp',
        type: 'address',
      },
    ],
    name: 'queryRewardsForLP2',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
        name: 'liquidor',
        type: 'address',
      },
    ],
    name: 'queryRewardsForLiquidor',
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
        name: 'lp',
        type: 'address',
      },
    ],
    name: 'queryStakeInfoForLP1',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'oriTokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'share',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reTokenAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct DDSRewards.LpInfo',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'oriTokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'share',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reTokenAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct DDSRewards.LpInfo',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'oriTokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'share',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reTokenAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct DDSRewards.LpInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lp',
        type: 'address',
      },
    ],
    name: 'queryStakeShareInfoForLP1',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    name: 'queryTotalRewardsForLP2',
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
    name: 'rewardsPerBlockForLP1',
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
    name: 'rewardsToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setParmsAfterHalving',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lp',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'oriTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reTokenAmount',
        type: 'uint256',
      },
    ],
    name: 'stakeRewardsForLP1',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalShared',
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
    name: 'totalStaked',
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
];
export const LiquidatorABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ddsReward',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'DAIErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDCErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDTErc',
    outputs: [
      {
        internalType: 'contract IERC20',
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
        name: 'liquidor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gasUsed',
        type: 'uint256',
      },
    ],
    name: 'calcLiquidorAmount',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ddsReward',
    outputs: [
      {
        internalType: 'contract DDSRewardsInterface',
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
        name: 'liquidor',
        type: 'address',
      },
    ],
    name: 'getFeeBackByLiquidor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    name: 'getGasPrice',
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
    name: 'getPriceByETHUSDC',
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
    name: 'getTotalFeeBack',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'liquidorsFeeBack',
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
    name: 'priceProviderByDAIETH',
    outputs: [
      {
        internalType: 'contract AggregatorV3Interface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceProviderByGASPRICE',
    outputs: [
      {
        internalType: 'contract AggregatorV3Interface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceProviderByUSDCETH',
    outputs: [
      {
        internalType: 'contract AggregatorV3Interface',
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
        name: '_ddsReward',
        type: 'address',
      },
    ],
    name: 'setDDSReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'totalFeeBack',
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
];
export const SwapBurnABI = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ddsReward',
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
    inputs: [],
    name: 'DAIErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDCErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDTErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_token',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'calcDDSPrice',
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
    name: 'ddsReward',
    outputs: [
      {
        internalType: 'contract DDSRewardsInterface',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBuyBackInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ddsAmount',
        type: 'uint256',
      },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract IERC20',
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
];
export const BrokerABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'DAIErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDCErc',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDTErc',
    outputs: [
      {
        internalType: 'contract IERC20',
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
        name: 'inviter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'invitee',
        type: 'address',
      },
    ],
    name: 'addInviteRelation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inviter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'invitee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'addInviteRelationAndCalc',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'brokerIfExistFlag',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'brokersRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'brokersClaimedRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'brokersClaimRewards',
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
        name: 'broker',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenType',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'calcBrokerAmountWithoutRating',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewardsForBroker',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'broker',
        type: 'address',
      },
    ],
    name: 'getBrokerAwardsInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
        name: 'broker',
        type: 'address',
      },
    ],
    name: 'getBrokerInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
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
        name: 'invitee',
        type: 'address',
      },
    ],
    name: 'getInviteByInvitee',
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
        name: 'inviter',
        type: 'address',
      },
    ],
    name: 'getInviteesByInviter',
    outputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
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
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'inviteTakers',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'takerIfExistFlag',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'takerInviters',
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
];

export const ERC20 = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

export interface ContractRead {
  getUserSelfWalletBalance(address: string): Observable<CoinBalance[]>;

  getUserSelfReTokenBalance(address: string): Observable<CoinBalance[]>;

  /**
   * 用户提供公池流动性获取的reToken信息
   *
   * @param address
   */
  getUserReTokenShareInfo(address: string): Observable<CoinShare[]>;

  priPoolUserBalance(address: string): Observable<PrivatePoolAccountInfo>;

  /**
   * 获取用户公池流动性质押的奖励（质押reToken）
   *
   * @param address
   */
  getReTokenLiquidityReward(address: string): Observable<PubPoolRewards>;

  /**
   * 用户公池流动性挖矿的质押信息
   */
  getPubPoolLiquidityShareInfo(address: string): Observable<PubPoolLockInfo>;
}

export interface ApprovalAction {
  approveReToken(reToken: IReUSDCoins): Observable<boolean>;

  needApproveReToken(amount: number, address: string, reToken: IReUSDCoins): Observable<boolean>;

  approveUSDFunding(usdToken: IUSDCoins): Observable<boolean>;

  needApproveUSDFunding(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  needApprovePubPool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  approvePubPool(usdToken: IUSDCoins): Observable<boolean>;

  needApprovePrivatePool(amount: number, address: string, usdToken: IUSDCoins): Observable<boolean>;

  approvePrivatePool(usdToken: IUSDCoins): Observable<boolean>;
}

export interface ActivityItems {
  claimTestToken(token: IUSDCoins): Observable<boolean>;

  isTestTokenClaimed(userAddr: string, token: IUSDCoins): Observable<boolean>;
}

/**
 * 合约接口
 */
export interface ContractProxy extends ContractRead, ApprovalAction, ActivityItems {
  //

  getPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  watchPriceByETHDAI(coin: IUSDCoins): Observable<BigNumber>;

  getUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  watchUserAccount(address: string, coin: IUSDCoins): Observable<UserAccountInfo>;

  getMaxOpenAmount(coin: IUSDCoins, exchange: IExchangeStr, maxUSDAmount: number): Observable<BigNumber>;

  getMaxOpenTradeAmount(
    exchange: ExchangeCoinPair,
    type: ITradeType,
    availableUsdAmount: number
  ): Observable<BigNumber>;

  depositToken(address: string, count: number, coin: IUSDCoins): Observable<boolean>;

  withdrawToken(count: number, coin: IUSDCoins): Observable<boolean>;

  confirmContract(exchangeStr: IExchangeStr, count: number, type: ITradeType): Observable<ConfirmInfo>;

  /**
   *
   * @param coin
   * @param orderType
   * @param amount
   * @param userPrice - 用户认可的价格
   * @param inviter
   * @param slider - 滑点价格百分比 8 === 8%
   * @param timeout - 超时时常 1分钟 === 60
   */
  createContract(
    coin: IUSDCoins,
    orderType: ITradeType,
    amount: number,
    userPrice: number,
    inviter: string,
    slider: number,
    timeout: number
  ): Observable<string>;

  closeContract(orderId: ITradeRecord): Observable<boolean>;

  getFundingLockedAmount(coin: IUSDCoins, exchange: IExchangeStr, ethAmount: number): Observable<BigNumber>;

  getUserOrders(address: string, curPrice: BigNumber, page: number, pageSize: number): Observable<any>;

  getPubPoolInfo(coin: IUSDCoins): Observable<any>;

  getPrivatePoolInfo(coin: IUSDCoins): Observable<any>;

  //

  getPubPoolDepositReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber>;

  getPubPoolWithdrawReTokenFromToken(coin: IUSDCoins, tokenAmount: number): Observable<BigNumber>;

  provideToPubPool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  withdrawFromPubPool(coin: IUSDCoins, reCoinAmount: number): Observable<boolean>;

  pubPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>>;

  pubPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>>;

  getReTokenBalance(address: string): Observable<CoinBalance[]>;

  getPubPoolWithdrawDate(address: string): Observable<{ coin: IUSDCoins; time: number }[]>;

  //

  getLockedLiquidityList(
    address: string,
    page: number,
    pageSize: number,
    devTest: boolean
  ): Observable<PrivateLockLiquidity[]>;

  addMarginAmount(orderId: string, coin: IUSDCoins, amount: number): Observable<boolean>;

  provideToPrivatePool(address: string, coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  withdrawFromPrivatePool(coin: IUSDCoins, coinAmount: number): Observable<boolean>;

  priPoolBalanceOf(address: string): Observable<Map<IUSDCoins, BigNumber>>;

  // priPoolBalanceWhole(): Observable<Map<IUSDCoins, BigNumber>>;

  /**
   * @param isReject - 是否停止接单。true：停止接单；false：继续接单
   */
  setPriPoolRejectOrder(isReject: boolean): Observable<boolean>;

  //

  getLiquidityMiningReward(address: string): Observable<BigNumber>;

  getLiquidityMiningShare(address: string): Observable<CoinShare[]>;

  /**
   * @Deprecated
   */
  getActiveLiquidityRewards(address: string): Observable<BigNumber>;

  /**
   * 质押reToken，储备流动性挖矿
   * @param reToken
   * @param reTokenAmount
   */
  lockReTokenForLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean>;

  unLockReTokenFromLiquidity(reToken: IReUSDCoins, reTokenAmount: number): Observable<boolean>;

  claimRewardsForLP1(): Observable<boolean>;

  //queryLockedReTokenAmount(): Observable<any>;

  claimRewardsForLP2(): Observable<boolean>;

  getSystemFundingBalance(): Observable<CoinBalance[]>;

  getLiquiditorRewards(address: string): Observable<LiquditorRewardsResult>;

  getLiquiditorPeriod(): Observable<{ startTime: BigNumber; period: BigNumber }>;

  getLiquiditorRewardsOfPeriod(
    address: string,
    period: number
  ): Observable<{
    rewards: CoinBalance[];
    info: { extSLD: BigNumber; rank: BigNumber };
  }>;

  getLiquiditorRatingList(period: number): Observable<string[]>;

  //

  getSwapBurnInfo(): Observable<CoinBalance[]>;

  doSwap(address: string, coin: IUSDCoins, ddsAmount: number): Observable<boolean>;

  getBrokerInfo(address: string): Observable<{ refer: BigNumber; claim: CoinBalance[] }>;

  getBrokerAllCommission(address: string): Observable<CoinBalance[]>;

  getBrokerMonthlyAwardsInfo(address: string): Observable<CoinBalance[]>;

  getBrokerMonthlyStartTime(): Observable<number>;

  getBrokerMonthlyRewardPool(): Observable<CoinBalance[]>;

  doBrokerClaim(): Observable<boolean>;
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

export interface CoinShare {
  coin: IUSDCoins;
  value: BigNumber;
  total: BigNumber;
}

export interface CoinBalance {
  coin: IUSDCoins | IReUSDCoins | ISLD;
  balance: BigNumber;
}

export interface PrivateLockLiquidity {
  orderId: number;
  usdToken: IUSDCoins;
  makerAddr: string;
  marginAmount: BigNumber;
  marginFee: BigNumber;
  takerId: BigNumber;
  status: IOrderStatus;
  locked: boolean;
}

export interface ConfirmInfo {
  currentPrice: BigNumber;
  exchgFee: BigNumber;
  openFee: BigNumber;
  total: BigNumber;
}

export interface ContractInfo {
  abi: any[];
  address: string;
}

export type LiquditorRewardsResult = {
  usdRewards: CoinBalance[];
  campaign: BigNumber;
  compensate: BigNumber;
  rank: BigNumber;
};

export interface PrivatePoolAccountInfo {
  total: CoinBalance[];
  available: CoinBalance[];
  locked: CoinBalance[];
  isRejectOrder: { coin: IUSDCoins; reject: boolean }[];
}

export interface PubPoolRewards {
  available: BigNumber;
  vesting: BigNumber;
  unactivated: BigNumber;
}

export interface ReTokenAmountNum {
  reDAI: BigNumber;
  reUSDT: BigNumber;
  reUSDC: BigNumber;
}

export interface LpTokenAmountNum {
  lpDAI: BigNumber;
  lpUSDT: BigNumber;
  lpUSDC: BigNumber;
}

export interface PubPoolLockInfo {
  lockedReToken: ReTokenAmountNum;
  totalLockedReToken: ReTokenAmountNum;
  lpToken: LpTokenAmountNum;
  totalLpToken: LpTokenAmountNum;
}
