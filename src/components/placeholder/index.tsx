import './style.less';

export default ({ width = '100%', height= '20px'}: any) => {
    return <div className="animated-background" style={{width: width, height}}></div>
}

export const sample = () => {
    return <div className="timeline-item">
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
}