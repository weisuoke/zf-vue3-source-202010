class Observer {
  constructor(value) { // 需要对这个value属性重新定义
    this.walk(value);
  }
  walk(data) {
    // 将对象中的所有 key 重新用 defineProperty 定义成响应式的
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

export function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if(newValue === value) return
      value = newValue
    }
  })
}

export function observe(data) {
  // 只对对象类型进行观测 非对象类型无法观测
  if (typeof data !== 'object' || data === null) {
    return;
  }
  // 通过类来实现对数据的观测 类可以方便扩展，会产生实例
  return new Observer(data)
}
