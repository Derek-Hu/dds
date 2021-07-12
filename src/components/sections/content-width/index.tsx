export default ({ children, className, maxWidth, ...rest }: any) => {
  return (
    <div className={['contentWidth', className].join(' ')} style={maxWidth ? { maxWidth } : {}} {...rest}>
      <div>{children}</div>
    </div>
  );
};
