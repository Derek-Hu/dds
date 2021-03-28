import * as React from 'react';

export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  connected: boolean | null;
  timestamp?: number;
  updateAccount?: (account: IAccount) => any;
  refreshPage?: () => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  connected: null,
  account: null,
});

export default SiteContext;
