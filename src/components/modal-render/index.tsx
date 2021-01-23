import SiteContext from "../../layouts/SiteContext";
import { Modal } from "antd-mobile";
import { ModalProps } from "antd-mobile/lib/modal/Modal";

export default (props: ModalProps & { children: React.ReactElement | React.ReactElement[] }) => {
  const { popup, children } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => (
        <Modal {...props} animationType="slide-up" popup={popup === undefined ? isMobile : popup}>
          {children}
        </Modal>
      )}
    </SiteContext.Consumer>
  );
};
