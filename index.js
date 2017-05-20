require('shelljs/global')

var program = require('commander')
var ora = require('ora')
var download = require('download-git-repo')
var { join } = require('path')
var fs = require('fs')

function help () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

var template = `zezhipeng/mina-${program.args[0]}`
var tmp = join(process.cwd(), program.args[1])

function downloadAndGenerate (template) {
  var spinner = ora('下载模板中')
  spinner.start()

  if (fs.existsSync(tmp)) rm('-rf', tmp)

  download(template, tmp, { clone: true }, function (err) {
    spinner.stop()
    if (err) console.log('下载模板失败:' + err.message.trim())
    else {
      console.log(`下载完成 \ncd ${program.args[1]}\ncnpm i or yarn`)
    }
  })
}

downloadAndGenerate(template)
