const settings = {
  github: {
    pathname: '/dds',
    debug: true,
  },
  dev: {
    pathname: '',
    debug: true,
  },
  prod: {
    pathname: '',
    debug: false,
  },
};
// @ts-ignore
export default settings[process.env.REACT_APP_APP_ENV];
