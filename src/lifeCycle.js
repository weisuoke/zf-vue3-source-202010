import Watcher from "./observer/watcher";

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log('_update')
  }
}

export function mountComponent(vm, el) {
  console.log(vm, el)
  // 默认 vue 是通过 watcher 来进行渲染 = 渲染watcher (每一个组件都有一个渲染 watcher)

  let updateComponent = () => {
    // NOTE: vm._update, 把虚拟节点变成真实节点
    vm._update(vm._render()); // 虚拟节点
  }

  new Watcher(vm, updateComponent, () => {

  }, true)
}
