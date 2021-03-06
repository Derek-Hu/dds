import * as React from 'react';
import { ISupporttedUSD } from '../constant';
export interface IAccount {
  address: string;
  coins: Record<ISupporttedUSD, number>;
}
export interface SiteContextProps {
  isMobile: boolean;
  direction: string;
  account?: IAccount;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
});

export default SiteContext;
