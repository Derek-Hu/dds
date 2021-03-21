import * as React from 'react';

export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  address: string;
  updateAccount?: (account: IAccount) => any;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  address: '',
  account: null,
});

export default SiteContext;
