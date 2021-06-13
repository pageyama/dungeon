const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    open: true,
  }
}
