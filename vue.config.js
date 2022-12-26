module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '^/api': {
        target: 'http://10.68.5.210:4000',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    }
  }
}
