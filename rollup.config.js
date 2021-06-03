import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'

export default { // 用于打包
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    name: 'Vue', // 全局的名字就是 vue
    format: 'umd',
    sourcemap: true, // es6 -> es5
  },
  plugins: [
    babel({
      exclude: "node_modules/**",  // 这个目录不需要用 babel 转换
    }),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    })
  ]
}
