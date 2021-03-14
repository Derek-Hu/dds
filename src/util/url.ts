export default () => {
  var params = {};

  const hash = /#/.test(window.location.href) && window.location.href.split('#')[1];

  // @ts-ignore
  const search = /\?/.test(hash) && hash.split('?')[1];
  // @ts-ignore
  var searchs = /\&/.test(search) ? search.split('&') : [search];
  for (var i = 0; i < searchs.length; i++) {
    if (/\=/.test(searchs[i])) {
      var item = searchs[i].split('=');
      // @ts-ignore
      params[item[0]] = item[1];
    }
  }
  return params;
};
