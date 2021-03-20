import * as React from 'react';
import { ISupporttedUSD } from '../constant';

export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: IAccount;
  updateAccount?: (account: IAccount) => any;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  account: null,
});

export default SiteContext;
