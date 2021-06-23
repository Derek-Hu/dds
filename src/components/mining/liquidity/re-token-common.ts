import { SelectOption } from '../../common/selects/normal-select';
import { Subject } from 'rxjs';

export const reTokenOptions: SelectOption[] = [
  { label: 'reDAI', value: 'reDAI' },
  { label: 'reUSDT', value: 'reUSDT' },
  { label: 'reUSDC', value: 'reUSDC' },
];

export type AvailableReTokens = {
  reDAI: number;
  reUSDT: number;
  reUSDC: number;
};

export type IProps = {
  refreshEvent: Subject<boolean>;
  onCancel?: () => void;
  doAction?: (reToken: IReUSDCoins, amount: number) => void;
};

export type IState = {
  curReToken: IReUSDCoins;
  maxReTokenAmount: number;
  curReTokenAmount: number;
  isPending: boolean;
  availableReTokensAmount: AvailableReTokens;
};

export const defaultState = (): IState => ({
  curReToken: 'reDAI' as const,
  maxReTokenAmount: 0,
  curReTokenAmount: 0,
  isPending: false,
  availableReTokensAmount: {
    reDAI: 0,
    reUSDT: 0,
    reUSDC: 0,
  },
});
