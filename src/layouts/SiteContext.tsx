import * as React from 'react';

export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  connected: boolean | null;
  updateAccount?: (account: IAccount) => any;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  connected: null,
  account: null,
});

export default SiteContext;
