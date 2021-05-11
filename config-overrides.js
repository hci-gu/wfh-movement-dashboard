const path = require('path')

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.worker\.js$/,
    include: [path.resolve(__dirname, 'src')],
    use: { loader: 'worker-loader' },
  })
  return config
}
