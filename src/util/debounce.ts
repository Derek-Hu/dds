// @ts-ignore
export function debounce(fn: (...any: any) => any, delay:number = 150) {
  // @ts-ignore
  var timer = null;
  return function (...args: any) {
    // @ts-ignore
    var context = this;
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
