import * as React from 'react';
import { ISupporttedUSD } from '../constant';
export interface IAccount {
  address: string;
  coins: Record<ISupporttedUSD, number>;
}
export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account: UserAccountInfo | null;
  updateAccount?: (account: UserAccountInfo) => any;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  account: null,
});

export default SiteContext;
