module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    }
  }
}
