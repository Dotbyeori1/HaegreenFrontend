const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, "./public/frontOffice"),
  devServer: {
    port: 3000,
    proxy: {
      '': {
        target: 'http://localhost', // 스프링부트 개발포트
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      // webpack.ProvidePlugin을 직접 참조합니다.
      new (require('webpack').ProvidePlugin)({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
};
