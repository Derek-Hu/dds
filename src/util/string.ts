export const toCamelCase = (val?: string) => {
  if (val === null || val === undefined) {
    return '';
  }
  return val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase();
};

export const getQueryStringParameters = (url?: string) => {
  let query = '';
  if (url) {
    if (url.split('?').length > 0) {
      query = url.split('?')[1];
    }
  } else {
    url = window.location.href;
    query = window.location.search.substring(1);
  }
  return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params: any, param) => {
    let [key, value] = param.split('=');
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    return params;
  }, {});
};
