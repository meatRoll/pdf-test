const path = require('path')
const url = require('url')
const puppeteer = require('puppeteer')
const chalk = require('chalk')

const ora = require('ora')

const test = async num => {
  const spinner = ora()
  spinner.start(`Testing Times: ${num}...`)
  const start = new Date()
  try {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreDefaultArgs: [ '--disable-extensions' ]
    })
    const [page] = await browser.pages()
    await page.goto(
      url.format({
        pathname: path.resolve(__dirname, 'content.html'),
        protocol: 'file:',
        slashes: true
      }),
      {
        waitUntil: 'networkidle0'
      }
    )
    await page.emulateMedia('screen')
    const pdfPath = path.resolve(__dirname, `../../temp/puppeteer-${num}.pdf`)
    await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      printBackground: true,
      path: pdfPath,
      margin: {
        top: 100,
        bottom: 100
      },
      headerTemplate: `
        <div style="width:100%;height:20px;font-size:16px;color:#000000;">这是头部</div>
      `,
      footerTemplate: `
        <div style="width:100%;height:20px;font-size:16px;color:#000000;">这是尾部</div>
      `
    })
    await browser.close()
    const end = new Date()
    const time = end - start
    spinner.succeed(`Testing Times: ${num} End. Duration: ${chalk.red(time)}ms`)
    return time
  } catch (e) {
    spinner.fail(`Testing Times: ${num} Error.`)
    throw e
  }
}

const getResult = async times => {
  let i = 0
  let timeSums = 0
  let succeedTimes = 0
  let failTimes = 0
  console.log('')
  console.log(`· Test ${chalk.underline('Puppeteer')} Starting.`)
  do {
    try {
      const singleTestTime = await test(++i)
      timeSums += singleTestTime
      succeedTimes++
    } catch (e) {
      console.error(e)
      failTimes++
    }
  } while (i < times)
  const time = Math.round(succeedTimes ? timeSums / succeedTimes : 0)
  console.log(`· Test ${chalk.underline('Puppeteer')} Finished. Succeeded: ${chalk.red(succeedTimes)}, failed: ${chalk.red(failTimes)}.`)
  return {
    title: 'puppeteer',
    time
  }
}

module.exports = {
  getResult
}