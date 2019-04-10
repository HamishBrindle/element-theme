var path = require('path')

var opts = {}

try {
  opts = require(path.resolve(process.cwd(), 'element-theme.config.js'))
} catch (err) {
  console.error('error reading file:', err);
}

var config = Object.assign({
  browsers: ['ie > 9', 'last 2 versions'],
  out: './theme',
  config: './element-variables.scss',
  sassVariables: null,
  jsVariables: null,
  theme: 'element-theme-chalk',
  minimize: false
}, opts)

exports.themePath = path.resolve(process.cwd(), './node_modules/' + config.theme)
exports.minimize = config.minimize
exports.browsers = config.browsers
exports.components = config.components
exports.themeName = config.theme

exports.out = config.out
exports.config = config.config
exports.jsVariables = config.jsVariables
exports.sassVariables = config.sassVariables
