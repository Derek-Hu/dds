import { CONTRACT_STATE } from './contract-state-def';
import { parseContractStateDefine } from './contract-state-parser';
import { parsePageStateTreeDefine } from './page-state-parser';
import { PAGE_STATE } from './page-state-def';

export const S = parseContractStateDefine(CONTRACT_STATE);
export const P = parsePageStateTreeDefine(PAGE_STATE);
