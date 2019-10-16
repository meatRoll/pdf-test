const fs = require('fs')
const path = require('path')
const open = require('open')
const chalk = require('chalk')

const {readDir, checkToRun, makeDir, emptyDir, buildReportHtml, multiTest} = require('./utils')

const {times} = require('./configs.json')

const run = async () => {
  console.log(chalk.hex('#90a906')('--------------------------------------------------------------------'))
  console.log(`${chalk.hex('#90a906')('----------------------------')} ${chalk.bold.bgYellowBright.gray(' PDF TEST ')} ${chalk.hex('#90a906')('----------------------------')}`)
  console.log(chalk.hex('#90a906')('--------------------------------------------------------------------'))
  console.log('')
  console.log(`Testing Times Each Plugin: ${chalk.bold.cyan(times)}.`)
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
        const {test} = require(filePath) 
        if (test) {
          const result = await multiTest({
            times,
            type: file,
            fn: test
          }) /* title, time */
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