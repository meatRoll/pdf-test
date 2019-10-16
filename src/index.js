const fs = require('fs')
const path = require('path')
const open = require('open')
const chalk = require('chalk')

const {readDir, checkToRun, makeDir, emptyDir, buildReportHtml, multiTest} = require('./utils')

const {times, contentLength} = require('./configs.json')

const run = async () => {
  console.log(chalk.hex('#90a906')('--------------------------------------------------------------------'))
  console.log(`${chalk.hex('#90a906')('----------------------------')} ${chalk.bold.bgYellowBright.gray(' PDF TEST ')} ${chalk.hex('#90a906')('----------------------------')}`)
  console.log(chalk.hex('#90a906')('--------------------------------------------------------------------'))
  console.log('')
  console.log(`Testing Times Each Plugin: ${chalk.bold.cyan(times)}, Content Length: ${chalk.bold.cyan(contentLength)}`)
  const start = new Date()
  try {
    const files = await readDir(__dirname)
    const results = []
    const tempDirPath = path.resolve(__dirname, '../temp')
    if (!fs.existsSync(tempDirPath)) await makeDir(tempDirPath)
    else await emptyDir(tempDirPath)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const dirPath = path.resolve(__dirname, file)
      const filePath = await checkToRun(dirPath)
      if (filePath) {
        const {test, testBefore, testAfter} = require(filePath) 
        if (test) {
          if (testBefore) await testBefore({contentLength})
          const result = await multiTest({
            times,
            contentLength,
            type: file,
            fn: test
          }) /* title, time */
          if (testAfter) await testAfter()
          if (result) results.push(result)
        }
      }
    }
    const filePath = await buildReportHtml(results)
    await open(filePath)
  } catch (e) {
    console.error(e)
  }
  const end = new Date()
  const time = end - start
  console.log('')
  console.log(`PDF Test Finished! Total: ${chalk.bold.redBright(time)}ms`)
}

run()