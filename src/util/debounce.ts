// @ts-ignore
export function debounce(fn: (...any: any) => any, delay = 150) {
  // @ts-ignore
  let timer = null;
  return function (...args: any) {
    // @ts-ignore
    const context = this;
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
