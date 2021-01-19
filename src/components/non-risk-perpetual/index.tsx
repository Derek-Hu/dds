import { Table, Row, Col } from "antd";
import styles from "./style.module.less";
import numeral from "numeral";
import SiteContext from "../../layouts/SiteContext";
import ColumnConvert from "../column-convert/index";

interface INonRiskPerpetual {
  coin: string;
  price: number;
  change: number;
  chart: string;
}


const columns = ColumnConvert<INonRiskPerpetual, { action: any }>({
    column: {
      coin: "Coin",
      price: <span className={styles.price}>Last Price</span>,
      change: <span className={styles.change}>24h Change</span>,
      chart: "Chart",
      action: "Action",
    },
    render(value, key) {
      switch (key) {
        case "coin":
          return (
            <span>
              <span className={styles.coin}>{value}</span>
              <span className={styles.usdt}> / USDT</span>
            </span>
          );
        case "price":
          return <span className={styles.priceVal}>{value}</span>;
        case "change":
          return (
            <span
              className={[
                styles.changeVal,
                value < 0 ? styles.negative : "",
              ].join(" ")}
            >
              {value > 0 ? "+" : ""}
              {value}%
            </span>
          );
        case "action":
          return <span className={styles.tradeBtn}>Trade</span>;
        default:
          return value;
      }
    },
  });

const data = [
  {
    coin: "BTC",
    price: "7173.77",
    change: 8.23,
  },
  {
    coin: "ETH",
    price: "183.28",
    change: -10.01,
  },
];

const total = 82323123;
export default () => {
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <div className={[styles.root, isMobile ? styles.mobile : ""].join(" ")}>
          <div className={styles.content}>
            <div className={styles.head}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={12} className={styles.col}>
                  <h2>Non-Risk Perpetual</h2>
                </Col>
                {isMobile ? null : (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    className={[styles.col, styles.summary].join(" ")}
                  >
                    <span>
                      24h trading volumn:{" "}
                      <span className={styles.total}>
                        {numeral(total).format("0,0")}
                      </span>{" "}
                      USD
                    </span>
                  </Col>
                )}
              </Row>
            </div>
            <Table
              rowKey="coin"
              columns={columns}
              scroll={ isMobile  ? { x: 800 }: undefined}
              pagination={false}
              dataSource={data}
            />
          </div>
        </div>
      )}
    </SiteContext.Consumer>
  );
};
