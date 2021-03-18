import SiteContext from '../../layouts/SiteContext';
import { Modal as DModal, Drawer } from 'antd';

export default (props: any) => {
  const { visible, children, title, height, closable, onCancel, maskClosable, className } = props;
  return (
    <SiteContext.Consumer>
      {({ isMobile }) => {
        return isMobile ? (
          <Drawer
            closable={closable}
            onClose={onCancel}
            title={title}
            height={height}
            maskClosable={maskClosable}
            placement="bottom"
            className="mobile"
            destroyOnClose={true}
            visible={visible}
          >
            {children}
          </Drawer>
        ) : (
          <DModal {...props} animationType="slide-up" closable={closable} maskClosable={maskClosable} title={title} onCancel={onCancel} className={className}>
            {children}
          </DModal>
        );
      }}
    </SiteContext.Consumer>
  );
};
