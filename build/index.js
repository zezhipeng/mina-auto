const config = require('../mina-config')
const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const webpackConf = require('./webpack.conf')
const { resolve } = require('path')
const sass = require('node-sass')
const r = url => resolve(process.cwd(), url)

const con = {
  stylus: function (file) {
    return new Promise(function (resolve) {
      var data = fs.readFileSync(file, 'utf8')

      require('stylus').render(data, { filename: file }, function (err, css) {        
        resolve(css)
      }) 
    })
  },
  less: function (file) {
    return new Promise(function (resolve) {
      var data = fs.readFileSync(file, 'utf8')

      require('less').render(data, {}, function (err, result) {
        resolve(result.css)
      }) 
    })
  },
  scss: function (file) {
    return new Promise(function (resolve) {
      var data = fs.readFileSync(file, 'utf8')

      require('node-sass').render({
        file, 
        data,
        outputStyle: 'compressed'
      }, function (err, result) {
        resolve(result.css)
      }) 
    })
  },
  sass: function (file) {
    return new Promise(function (resolve) {
      var data = fs.readFileSync(file, 'utf8')

      require('node-sass').render({
        file, 
        data,
        outputStyle: 'compressed',
        indentedSyntax: true
      }, function (err, result) {
        resolve(result.css)
      }) 
    })
  }
}


require('shelljs/global')

const assetsPath = r('./dist')

rm('-rf', assetsPath)
mkdir(assetsPath)

var renderConf = webpackConf

var entry = () => _.reduce(config.json.pages, (en, i) => {
  en[i] = resolve(process.cwd(), './', `${i}.mina`)

  return en
}, {})

renderConf.output = {
  path: r('./dist'),
  filename: '[name].js'
}

renderConf.entry = entry()
renderConf.entry.app = config.app

var compiler = webpack(renderConf)

fs.writeFileSync(r('./dist/app.json'), JSON.stringify(config.json), 'utf8')

con[config.style.lang](config.style.url)
  .then(function (result) {
    fs.writeFileSync(r('./dist/app.wxss'), result, 'utf8')
  })

compiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
}, (err, stats) => {
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: true,
    chunks: true,
    chunkModules: true
  }) + '\n\n')
})
