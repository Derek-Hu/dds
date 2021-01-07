const message = "hello world";
const error = '本类不能实例化';
class Point {
  constructor(){
      if(new.target === Point){
        throw new Error(error);
      }
  }
  static hello() {
    return message;
  }
  static baz() {
    return this.hello();
  }
  toString() {}
}

class ColorPoint extends Point {
  static say() {
    return super.baz();
  }
}

const color = new ColorPoint();

console.log(
  [
    Object.getPrototypeOf(ColorPoint) === Point,
    ColorPoint.__proto__ === Point,
    ColorPoint.prototype.__proto__ === Point.prototype,
    ColorPoint.prototype.constructor === ColorPoint,
    ColorPoint.hello() === message,
    ColorPoint.baz() === message,
    ColorPoint.say() === message,
    Object.keys(Point.prototype).length === 0,
    color.constructor === ColorPoint,
    color.__proto__ === ColorPoint.prototype,

  ].every((val) => val === true)
);

try{
    new Point()
}catch(e){
    console.log(e.message === error);
}