import * as React from 'react';

export interface ISiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  connected: boolean | null;
  isBSC: boolean;
  timestamp?: number;
  currentNetwork: INetworkKey;
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
  connected: null,
  account: null,
});

export default SiteContext;
