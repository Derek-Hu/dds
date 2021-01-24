import SiteContext from "../../layouts/SiteContext";
import { Modal as MModal } from "antd-mobile";
import { Modal as DModal } from "antd";

export default (
  props: any
) => {
  const { popup, children, onCancel } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => {
        return isMobile ? <MModal
          {...props}
          animationType="slide-up"
          onClose={onCancel}
          popup={popup === undefined ? isMobile : popup}
        >
          {children}
        </MModal> : <DModal
          {...props}
          animationType="slide-up"
          onCancel={onCancel}
          popup={popup === undefined ? isMobile : popup}
        >
          {children}
        </DModal>;
      }}
    </SiteContext.Consumer>
  );
};
