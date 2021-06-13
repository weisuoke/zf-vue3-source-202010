(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var oldArrayProtoMethods = Array.prototype; // 不能直接改写数组原有的方法 不可靠，因为只有被 vue 控制的数组才需要改写

  var arrayMethods = Object.create(Array.prototype);
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
  methods.forEach(function (method) {
    // AOP 切片编程
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      // 重写数组方法
      console.log('数组变化'); // todo...

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args));

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 需要对这个value属性重新定义
      // value 可能是对象 可能是数组，分类处理
      if (Array.isArray(value)) {
        // 数组不用 defineProperty 来进行代理，性能不好
        // push shift reverse sort 我要重写这些方法增加更新逻辑
        Object.setPrototypeOf(value, arrayMethods); // 循环将属性赋予上去

        this.observeArray(value); // 原有数组中的对象
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        // 将对象中的所有 key 重新用 defineProperty 定义成响应式的
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // vue2 中数据嵌套不要过深，过深浪费性能
    // value 可能也是一个对象
    observe(value); // 对结果递归拦截

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 如果用户设置的是一个对象，就继续将用户设置的对象变成响应式的

        value = newValue;
      }
    });
  }
  function observe(data) {
    // 只对对象类型进行观测 非对象类型无法观测
    if (_typeof(data) !== 'object' || data === null) {
      return;
    } // 通过类来实现对数据的观测 类可以方便扩展，会产生实例


    return new Observer(data);
  }

  function initState(vm) {
    // 将所有数据都定义在 vm 属性上，并且后续更改 需要触发视图更新
    var opts = vm.$options; // 获取用户属性

    if (opts.data) {
      // 数据初始化
      initData(vm);
    }
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    // 数据劫持 Object.defineProperty
    var data = vm.$options.data; // 对 data 类型进行判断 如果是函数 获取函数返回值作为对象

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 通过 vm._data 获取劫持后的数据，用户就拿到这个 _data
    // 将 _data 中的数据全部放到 vm 上

    for (var key in data) {
      proxy(vm, '_data', key); // vm.name => vm._data.name
    } // 观测这个数据


    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 实例上有个属性 $options 表示的是用户传入的所有属性
      // 初始化状态

      initState(vm);
    };
  }

  // Vue2.0 就是一个构造函数

  function Vue(options) {
    this._init(options); // 当用户 new Vue时， 就调用 init 方法进行vue的初始化

  } // 可以拆分逻辑到不同的文件中 更利于代码维护 模块化的概念


  initMixin(Vue);
   // 库 => rollup 项目开发 webpack

  return Vue;

})));
//# sourceMappingURL=vue.js.map
