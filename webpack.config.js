const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js', //入口文件，就是在src目录下的index.js文件，
  output: {
    path: path.resolve(__dirname, './dist'), //输出路径dist目录
    publicPath: '/dist/',
    filename: 'sticky-anchor.min.js', //打包后输出的文件名字,这里需要和package.json文件下main应该写为:'dist/sticky-anchor.min.js'
    libraryTarget: "umd"
  },
  //这里我们可以剔除掉一些通用包,自己的包不打包这些类库,需要用户环境来提供
  externals: {
    vue: 'vue'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'scss-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader' //babel的相关配置在.babelrc文件里
      }
    ]
  }
};
