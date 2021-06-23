export const orderTips = (txs: string[]) =>
  txs.map(tx => (
    <span>
      Order {tx} canceled. <br />
    </span>
  ));
