// Vue2.0 就是一个构造函数
import {initMixin} from "./init";
import {lifeCycleMixin} from "./lifeCycle";
import {renderMixin} from "./render";

function Vue(options) {
  this._init(options);  // 当用户 new Vue时， 就调用 init 方法进行vue的初始化
}

// 可以拆分逻辑到不同的文件中 更利于代码维护 模块化的概念
initMixin(Vue)  // 扩展初始化方法
lifeCycleMixin(Vue) // 扩展 _update 方法
renderMixin(Vue)  // 扩展 _render 方法

export default Vue

// 库 => rollup 项目开发 webpack
