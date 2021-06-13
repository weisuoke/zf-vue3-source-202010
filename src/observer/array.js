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
    console.log('数组变化')
    // todo...
    let result = oldArrayProtoMethods[method].call(this, ...args)

    return result
  }
})
