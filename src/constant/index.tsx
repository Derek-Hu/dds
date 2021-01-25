import { Select } from "antd";

const { Option } = Select;

export const SupportedCoins = ["DAI", "USDC", "USDT"];

export const CustomTabKey = "dds-tabs";

export const CoinSelectOption = SupportedCoins.map(coin => <Option value={coin}>{coin}</Option>);
