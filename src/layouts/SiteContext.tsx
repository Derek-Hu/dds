import * as React from 'react';
import { EthNetwork } from '../constant/network';

export interface ISiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  connected: boolean | null;
  isBSC: boolean;
  timestamp?: number;
  currentNetwork: INetworkKey;
  network: EthNetwork;
  updateAccount?: (account: IAccount) => any;
  switNetwork?: (network: INetworkKey) => any;
  refreshPage?: () => void;
}

const SiteContext = React.createContext<ISiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  isBSC: false,
  currentNetwork: 'kovan',
  network: EthNetwork.kovan,
  connected: null,
  account: null,
});

export default SiteContext;
