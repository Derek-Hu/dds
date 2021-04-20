import * as React from 'react';

export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  connected: boolean | null;
  timestamp?: number;
  network: string;
  updateAccount?: (account: IAccount) => any;
  switNetwork?: (network: string) => any;
  refreshPage?: () => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  network: 'kovan',
  connected: null,
  account: null,
});

export default SiteContext;
