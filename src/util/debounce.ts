// @ts-ignore
export function debounce(fn, delay) {
  // @ts-ignore
  var timer = null;
  return function () {
    // @ts-ignore
    var context = this;
    var args = arguments;
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
