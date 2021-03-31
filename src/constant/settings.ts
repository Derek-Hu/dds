const settings = {
  github: {
    pathname: '/dds',
  },
  dev: {
    pathname: '',
  },
  prod: {
    pathname: '',
  },
};
// @ts-ignore
export default settings[process.env.REACT_APP_APP_ENV];
