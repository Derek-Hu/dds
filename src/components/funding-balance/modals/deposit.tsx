import FillGrid from "../../fill-grid/index";
import { Tabs, Button, Row, Col, Select, Input } from "antd";
import ModalRender from "../../modal-render/index";

const { Option } = Select;

const title = "Funding Deposit";

export default (props: any) => {
  const { visible } = props;
  return (
    <ModalRender visible={visible}>
      <div>
        <h4>{title}</h4>
        <FillGrid
          left={
            <Select defaultValue="lucy" style={{ width: 120, height: 50 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          }
          right={<Input placeholder="amount for providing to the pool" />}
        />
      </div>
    </ModalRender>
  );
};
