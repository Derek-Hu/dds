import { getLocalStorageKey } from '../util/string';
import { LocalStorageKeyPrefix } from '../constant';
import { getCurNetwork, getCurUserAccount } from './account';
import { CentralPath, EthNetwork } from '../constant/address';

function settingStoragekey(): string {
  const address: string = getCurUserAccount() || '';
  const netid: EthNetwork | null = getCurNetwork();
  const network: string = netid !== null ? CentralPath[netid] : '';
  const storageKey: string = getLocalStorageKey(LocalStorageKeyPrefix.TradeSetting, address, network);

  return storageKey;
}

export function readTradeSetting(): TradeSetting | null {
  const settingStr: string | null = localStorage.getItem(settingStoragekey());
  if (settingStr === null) {
    return null;
  }

  try {
    const setting: TradeSetting = JSON.parse(settingStr);

    return setting;
  } catch (err) {
    return null;
  }
}

export function writeTradeSetting(setting: TradeSetting) {
  const settingStr: string = JSON.stringify(setting);

  localStorage.setItem(settingStoragekey(), settingStr);
}
