var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var concat = require('gulp-concat')
var ora = require('ora')
var nop = require('gulp-nop')
var sass = require('gulp-sass')
var file = require('gulp-file')
var autoprefixer = require('gulp-autoprefixer')
var cssmin = require('gulp-cssmin')
var config = require('./config')

/**
 * Iterates recursively through an object of styles and
 * creates SCSS variables and maps as a string to be later
 * parsed/written to a stream.
 * 
 * @param {object} obj - styles map
 * @param {string[]} strArr - contains each line of the soon-to-be SCSS file
 * @param {boolean} isMap - is the func appending strings from within a map?
 */
var toSassRecursive = function (obj, strArr, isMap) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      strArr.push('$' + k + ': (')
      toSassRecursive(obj[k], strArr, true)
      strArr.push(');')
    } else {
      if (isMap) strArr.push('\t' + k + ': ' + obj[k] + ',')
      else strArr.push('$' + k + ': ' + obj[k] + ';')
    }
  }
}

exports.fonts = function (opts) {
  var spin = ora(opts.message).start()
  var stream = gulp.src(path.resolve(config.themePath, './src/fonts/**'))
    .pipe((opts.minimize || config.minimize) ? cssmin({ showLog: false }) : nop())
    .pipe(gulp.dest(path.resolve(opts.out || config.out, './fonts')))
    .on('end', function () {
      spin.succeed()
    })

  return stream
}

exports.variables = function (opts) {
  var spin = ora(opts.message).start()
  var jsonVariables
  var jsonStream
  var sassStream
  var sassContents = []
  if (!config.jsonVariables) {
    throw new Error('element-theme: Unable to find JSON variables to work with!');  
  }
  if (!config.sassVariables) {
    throw new Error('element-theme: Unable to find SASS variables for the element theme!')
  }
  jsonVariables = require(path.resolve(config.jsonVariables))
  if (!jsonVariables) {
    throw new Error('element-theme: Invalid JSON data provided!')
  }
  toSassRecursive(jsonVariables, sassContents, false)
  sassContents.unshift('/* SASS variables from global JSON styles */')
  sassContents.push('\n')
  jsonStream = file('_tmp.scss', sassContents.join('\n')) // File name not important here
  sassStream = gulp.src(opts.sassVariables || config.sassVariables, { passthrough: true })
  return jsonStream
    .pipe(sassStream)
    .pipe(concat('_combined.scss'))
    .pipe(gulp.dest(opts.config || config.config))
    .on('end', function () {
      spin.succeed()
    })
}

exports.build = function (opts) {
  var spin = ora(opts.message).start()
  var stream
  var components
  var cssFiles = '*'
  var paths = []
  
  paths.push(path.resolve((opts.config || config.config), './_combined.scss'))
  paths.push(path.resolve(config.themePath, './src/' + cssFiles + '.scss'))
  
  if (config.components) {
    components = config.components.concat(['base'])
    cssFiles = '{' + components.join(',') + '}'
  }
  var varsPath = path.resolve(config.themePath, './src/common/var.scss')
  fs.writeFileSync(varsPath, fs.readFileSync(path.resolve(process.cwd(), paths[0])), 'utf-8')
  
  stream = gulp.src(paths)
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: config.browsers,
      cascade: false
    }))
    .pipe((opts.minimize || config.minimize) ? cssmin({showLog: false}) : nop())
    .pipe(gulp.dest(opts.out || config.out))
    .on('end', function () {
      spin.succeed()
    })

  return stream
}
