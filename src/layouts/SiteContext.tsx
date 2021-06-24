import * as React from 'react';
import { EthNetwork } from '../constant/network';

export interface ISiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string | null;
  connected: boolean | null;
  isBSC: boolean;
  timestamp?: number;
  currentNetwork: INetworkKey;
  network: EthNetwork | null;
  updateAccount?: (account: IAccount) => any;
  switNetwork?: (network: INetworkKey) => any;
  refreshPage?: () => void;
}

const SiteContext = React.createContext<ISiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  isBSC: true,
  currentNetwork: 'bsctest',
  network: null,
  connected: null,
  account: null,
});

export default SiteContext;
