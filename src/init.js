import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
import { mountComponent } from './lifeCycle'

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options;  // 实例上有个属性 $options 表示的是用户传入的所有属性
    // 初始化状态
    initState(vm);

    if (vm.$options.el) { // 数据可以挂载到页面上
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    const vm = this;
    const options = vm.$options

    // 如果有 render 就直接使用 render
    // 没有 render 看有没有 template 属性
    // 没有 template 就接着找外部模板
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;  // 火狐不兼容 document.createElement('div').appendChild('app').innerHTML
      }
      console.log(template)
      // 如何将模板编译成 render 函数
      const render = compileToFunctions(template)
      options.render = render
    }

    mountComponent(vm, el); // 组件挂载
  }
}
