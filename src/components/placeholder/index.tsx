import './style.less';

interface IProps {
  width?: string;
  height?: string;
  loading: boolean;
  children: any;
  style?: any;
}
export default ({ width = '100%', style, height = '20px', loading, children }: IProps) => {
  return loading ? (
    <div className="animated-background" style={{ width: width, height, ...style }}></div>
  ) : (
    <div>{children}</div>
  );
};

export const sample = () => {
  return (
    <div className="timeline-item">
      <div className="animated-background">
        <div className="background-masker header-top"></div>
        <div className="background-masker header-left"></div>
        <div className="background-masker header-right"></div>
        <div className="background-masker header-bottom"></div>
        <div className="background-masker subheader-left"></div>
        <div className="background-masker subheader-right"></div>
        <div className="background-masker subheader-bottom"></div>
      </div>
    </div>
  );
};
