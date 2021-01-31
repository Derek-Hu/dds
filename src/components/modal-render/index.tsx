import SiteContext from "../../layouts/SiteContext";
import { Modal as DModal, Drawer } from "antd";

export default (props: any) => {
  const { visible, children, title, height, onCancel, className } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => {
        return isMobile ? <Drawer 
        closable={false}
        onClose={onCancel}
        title={title}
        height={height}
        placement="bottom"
        className="mobile"
        destroyOnClose={true}
        visible={visible}
        >{children}</Drawer> : 
          <DModal
            {...props}
            animationType="slide-up"
            title={title}
            onCancel={onCancel}
            className={className}
            // popup={popup === undefined ? isMobile : popup}
          >
            {children}
          </DModal>
      }}
    </SiteContext.Consumer>
  );
};

// return isMobile ? <MModal
//           {...props}
//           animationType="slide-up"
//           onClose={onCancel}
//           popup={popup === undefined ? isMobile : popup}
//         >
//           {children}
//         </MModal> : <DModal
//           {...props}
//           animationType="slide-up"
//           onCancel={onCancel}
//           className={className}
//           popup={popup === undefined ? isMobile : popup}
//         >
//           {children}
//         </DModal>;
