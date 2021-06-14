let oldArrayProtoMethods = Array.prototype;

// 不能直接改写数组原有的方法 不可靠，因为只有被 vue 控制的数组才需要改写
export let arrayMethods = Object.create(Array.prototype)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort'
]

methods.forEach(method => { // AOP 切片编程
  arrayMethods[method] = function (...args) { // 重写数组方法
    // todo...
    // 有可能用户新增的数据是对象格式，也需要进行拦截
    let result = oldArrayProtoMethods[method].call(this, ...args)
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted)
    return result
  }
})
