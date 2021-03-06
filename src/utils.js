const fs = require('fs')
const path = require('path')
const empty = require('empty-folder')
const chalk = require('chalk')
const ora = require('ora')

const readDir = dirPath => new Promise((resolve, reject) => {
  fs.readdir(dirPath, (e, files) => {
    if (e) reject(e)
    else resolve(files)
  })
})

const checkToRun = dirPath => new Promise((resolve, reject) => {
  fs.stat(dirPath, (e, stats) => {
    if (e) {
      reject(e)
      return
    }
    if (!stats.isDirectory(dirPath)) {
      resolve()
      return
    }
    const indexFilePath = path.resolve(dirPath, 'index.js')
    if (fs.existsSync(indexFilePath)) resolve(indexFilePath)
    else resolve()
  })
})

const makeDir = dirPath => new Promise((resolve, reject) => {
  fs.mkdir(dirPath, e => {
    if (e) reject(e)
    else resolve()
  })
})

const emptyDir = dirPath => new Promise((resolve, reject) => {
  empty(dirPath, false, ({error, removed, failed}) => {
    if (error) reject(error)
    else resolve({removed, failed})
  })
})

const writeFile = (filePath, content) => new Promise(async (resolve, reject) => {
  fs.writeFile(filePath, content, e => {
    if (e) reject(e)
    else resolve()
  })
})

const buildReportHtml = async results => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>测试结果</title>
      <style>
        .title {
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          margin: 0;
          padding: 15px 0;
        }
        .result {
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 18px;
          color: #1A1A1A;
          margin: 0;
          padding: 5px 0;
        }
      </style>
    </head>
    <body>
      <h3 class="title">测试结果如下：</h3>
      ${results.map(result => `
        <div class="result">
          <span class="key">${result.title}：</span>
          <span class="value">${result.time}ms</span>
        </div>
      `).join('')}
    </body>
    </html>
  `
  const filePath = path.resolve(__dirname, '../temp/report.html')
  await writeFile(filePath, html)
  return filePath
}

const multiTest = async ({
  times,
  contentLength,
  type,
  fn
}) => {
  let i = 0
  let timeSums = 0
  let succeedTimes = 0
  let failTimes = 0
  const errorHandler = (e, spinner, num) => {
    spinner.fail(`Testing Times: ${num} Error.`)
    console.error(e)
    failTimes++
  }
  type = type.toLowerCase()
  const _type = `${type[0].toUpperCase()}${type.slice(1)}`
  console.log('')
  console.log(`· Test ${chalk.underline(_type)} Starting.`)
  do {
    const spinner = ora()
    i++
    try {
      spinner.start(`Testing Times: ${i}...`)
      const singleTestTime = await fn(i, contentLength)
      if (singleTestTime === undefined) {
        const error = Error('The Testing Function Can\'t Return Undefined.')
        errorHandler(error, spinner, i)
      } else {
        spinner.succeed(`Testing Times: ${i} End. Duration: ${chalk.red(singleTestTime)}ms`)
        timeSums += singleTestTime
        succeedTimes++
      }
    } catch (e) {
      errorHandler(e, spinner, i)
    }
  } while (i < times)
  const time = Math.round(succeedTimes ? timeSums / succeedTimes : 0)
  console.log(`· Test ${chalk.underline(_type)} Finished. Succeeded: ${chalk.red(succeedTimes)}, Failed: ${chalk.red(failTimes)}.`)
  return {
    title: type,
    time
  }
}

module.exports = {
  readDir,
  checkToRun,
  makeDir,
  emptyDir,
  buildReportHtml,
  writeFile,
  multiTest
}