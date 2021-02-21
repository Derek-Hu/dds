import { Select } from "antd";

const { Option } = Select;

export const SupporttedUSD = {
    'DAI': 'DAI',
    'USDC': 'USDC',
    'USDT': 'USDT'
}

export const SupporttedCoins = {
    'ETH': 'ETH',
    'WBTC': 'WBTC',
}

export const SupportedCoins = Object.keys(SupporttedUSD);

export const CustomTabKey = "dds-tabs";

export const CoinSelectOption = SupportedCoins.map(coin => <Option value={coin}>{coin}</Option>);

export type ISupporttedUSD = keyof typeof SupporttedUSD;
export type ICoins = keyof typeof SupporttedCoins;
